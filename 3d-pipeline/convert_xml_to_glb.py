#!/usr/bin/env python3
"""
LLEDO 3D Pipeline — XML to GLB Converter (Blender CLI)

Usage:
  blender --background --python convert_xml_to_glb.py -- --input fichier.xml --output output.glb

Supports: COLLADA (.dae), X3D (.x3d), and generic XML (auto-detect).
"""

import bpy
import bmesh
import sys
import os
import argparse
import xml.etree.ElementTree as ET


# ─── ARGUMENT PARSING ───────────────────────────────────────────────────────────

def parse_args():
    """Parse arguments after the '--' separator."""
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []

    parser = argparse.ArgumentParser(description="Convert XML 3D file to GLB")
    parser.add_argument("--input", required=True, help="Input XML/DAE/X3D file path")
    parser.add_argument("--output", required=True, help="Output GLB file path")
    parser.add_argument("--metallic", type=float, default=1.0, help="Metallic value (0-1)")
    parser.add_argument("--roughness", type=float, default=0.3, help="Roughness value (0-1)")
    parser.add_argument("--draco", action="store_true", default=True, help="Enable Draco compression")
    return parser.parse_args(argv)


# ─── FORMAT DETECTION ────────────────────────────────────────────────────────────

def detect_format(filepath):
    """Auto-detect the XML 3D format by inspecting the file content."""
    ext = os.path.splitext(filepath)[1].lower()

    # Extension-based detection
    if ext == ".dae":
        return "COLLADA"
    if ext in (".x3d", ".x3dv"):
        return "X3D"

    # Content-based detection for .xml or unknown extensions
    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        tag = root.tag.lower()
        ns = root.tag  # full tag with namespace

        if "collada" in tag or "collada" in ns.lower():
            return "COLLADA"
        if "x3d" in tag:
            return "X3D"

        # Check first-level children
        children_tags = [child.tag.lower() for child in root]
        if any("scene" in t and "x3d" in t for t in children_tags):
            return "X3D"
        if any("library" in t for t in children_tags):
            return "COLLADA"

    except ET.ParseError:
        pass

    # Default: try COLLADA first (most common for industrial assemblies)
    print(f"[WARN] Could not auto-detect format for '{filepath}', trying COLLADA...")
    return "COLLADA"


# ─── SCENE CLEANUP ───────────────────────────────────────────────────────────────

def clear_scene():
    """Remove all default objects from the scene."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Clear orphan data
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)
    for block in bpy.data.cameras:
        if block.users == 0:
            bpy.data.cameras.remove(block)
    for block in bpy.data.lights:
        if block.users == 0:
            bpy.data.lights.remove(block)


# ─── IMPORT ──────────────────────────────────────────────────────────────────────

def import_file(filepath, fmt):
    """Import the 3D file based on detected format."""
    abs_path = os.path.abspath(filepath)

    if not os.path.exists(abs_path):
        raise FileNotFoundError(f"Input file not found: {abs_path}")

    print(f"[INFO] Importing {fmt} file: {abs_path}")

    if fmt == "COLLADA":
        bpy.ops.wm.collada_import(filepath=abs_path)
    elif fmt == "X3D":
        bpy.ops.import_scene.x3d(filepath=abs_path)
    else:
        # Fallback: try COLLADA
        try:
            bpy.ops.wm.collada_import(filepath=abs_path)
        except Exception:
            print("[WARN] COLLADA import failed, trying X3D...")
            bpy.ops.import_scene.x3d(filepath=abs_path)

    imported_objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    print(f"[INFO] Imported {len(imported_objects)} mesh object(s)")
    return imported_objects


# ─── GEOMETRY CLEANUP ────────────────────────────────────────────────────────────

def clean_geometry(objects):
    """Clean all mesh objects: remove doubles, recalculate normals, apply transforms."""
    print(f"[INFO] Cleaning geometry for {len(objects)} object(s)...")

    for obj in objects:
        if obj.type != 'MESH':
            continue

        # Select and make active
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)

        # Apply all transforms (location, rotation, scale)
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

        # Enter edit mode via bmesh for cleanup
        mesh = obj.data
        bm = bmesh.new()
        bm.from_mesh(mesh)

        # Remove duplicate vertices (merge by distance)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0001)

        # Recalculate normals (outside)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

        # Write back
        bm.to_mesh(mesh)
        bm.free()

        # Smooth shading
        for poly in mesh.polygons:
            poly.use_smooth = True

        obj.select_set(False)

    print("[INFO] Geometry cleanup complete")


# ─── PBR MATERIAL ────────────────────────────────────────────────────────────────

def create_metal_material(metallic=1.0, roughness=0.3):
    """Create a brushed aluminium PBR material."""
    mat = bpy.data.materials.new(name="LLEDO_BrushedAluminium")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    for node in nodes:
        nodes.remove(node)

    # Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = (0.77, 0.78, 0.78, 1.0)  # Aluminium
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Specular IOR Level'].default_value = 0.5

    # Output
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (300, 0)
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    # Add subtle noise for brushed effect
    noise = nodes.new('ShaderNodeTexNoise')
    noise.location = (-400, -100)
    noise.inputs['Scale'].default_value = 200.0
    noise.inputs['Detail'].default_value = 8.0
    noise.inputs['Roughness'].default_value = 0.7

    # Color ramp for subtle variation
    ramp = nodes.new('ShaderNodeValToRGB')
    ramp.location = (-200, -100)
    ramp.color_ramp.elements[0].position = 0.4
    ramp.color_ramp.elements[0].color = (roughness - 0.05, roughness - 0.05, roughness - 0.05, 1)
    ramp.color_ramp.elements[1].position = 0.6
    ramp.color_ramp.elements[1].color = (roughness + 0.05, roughness + 0.05, roughness + 0.05, 1)

    links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
    links.new(ramp.outputs['Color'], bsdf.inputs['Roughness'])

    print("[INFO] Created PBR brushed aluminium material")
    return mat


def apply_material(objects, material):
    """Apply material to all mesh objects."""
    count = 0
    for obj in objects:
        if obj.type != 'MESH':
            continue

        # Clear existing materials
        obj.data.materials.clear()
        obj.data.materials.append(material)
        count += 1

    print(f"[INFO] Applied material to {count} mesh(es)")


# ─── EXPORT ──────────────────────────────────────────────────────────────────────

def export_glb(filepath, use_draco=True):
    """Export scene to GLB with optional Draco compression."""
    abs_path = os.path.abspath(filepath)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(abs_path) or ".", exist_ok=True)

    print(f"[INFO] Exporting GLB to: {abs_path}")
    print(f"[INFO] Draco compression: {'ON' if use_draco else 'OFF'}")

    export_settings = {
        'filepath': abs_path,
        'check_existing': False,
        'export_format': 'GLB',
        'export_apply': True,
        'export_texcoords': True,
        'export_normals': True,
        'export_materials': 'EXPORT',
        'export_colors': True,
        'export_cameras': False,
        'export_lights': False,
        'export_yup': True,
    }

    if use_draco:
        export_settings.update({
            'export_draco_mesh_compression_enable': True,
            'export_draco_mesh_compression_level': 6,
            'export_draco_position_quantization': 14,
            'export_draco_normal_quantization': 10,
            'export_draco_texcoord_quantization': 12,
            'export_draco_color_quantization': 10,
        })

    bpy.ops.export_scene.gltf(**export_settings)

    if os.path.exists(abs_path):
        size_mb = os.path.getsize(abs_path) / (1024 * 1024)
        print(f"[OK] Export successful: {abs_path} ({size_mb:.2f} MB)")
    else:
        print(f"[ERROR] Export failed — file not created")


# ─── MAIN ────────────────────────────────────────────────────────────────────────

def main():
    args = parse_args()

    print("=" * 60)
    print("  LLEDO 3D Pipeline — XML to GLB Converter")
    print("=" * 60)
    print(f"  Input:  {args.input}")
    print(f"  Output: {args.output}")
    print(f"  Metal:  {args.metallic} | Rough: {args.roughness}")
    print("=" * 60)

    # 1. Detect format
    fmt = detect_format(args.input)
    print(f"[INFO] Detected format: {fmt}")

    # 2. Clear scene
    clear_scene()

    # 3. Import
    objects = import_file(args.input, fmt)

    if not objects:
        print("[ERROR] No mesh objects imported. Aborting.")
        sys.exit(1)

    # 4. Clean geometry
    clean_geometry(objects)

    # 5. Create and apply material
    material = create_metal_material(args.metallic, args.roughness)
    apply_material(objects, material)

    # 6. Export GLB
    export_glb(args.output, use_draco=args.draco)

    print("\n[DONE] Pipeline complete.")


if __name__ == "__main__":
    main()
