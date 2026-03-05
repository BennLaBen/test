#!/usr/bin/env python3
"""
LLEDO 3D Pipeline — 3DXML (CATIA V5) to GLB Converter

Parses Dassault Systèmes 3DXML archives containing binary V5_CFV3 (.3DRep) files,
extracts tessellation data, reconstructs meshes with assembly transforms,
and exports to GLB format.

Usage:
  python convert_3dxml_to_glb.py --input "RL-R125-03-000 - ROLLER H125.3dxml" --output output.glb

Requirements:
  pip install numpy trimesh pygltflib

For Blender PBR material + Draco compression, chain with:
  blender --background --python convert_xml_to_glb.py -- --input output_raw.glb --output output.glb
"""

import zipfile
import struct
import sys
import os
import argparse
import xml.etree.ElementTree as ET
import math
import json
from io import BytesIO

try:
    import numpy as np
except ImportError:
    print("[ERROR] numpy is required: pip install numpy")
    sys.exit(1)

try:
    import trimesh
except ImportError:
    print("[ERROR] trimesh is required: pip install trimesh")
    sys.exit(1)


# ─── ARGUMENT PARSING ───────────────────────────────────────────────────────────

def parse_args():
    parser = argparse.ArgumentParser(description="Convert 3DXML to GLB")
    parser.add_argument("--input", required=True, help="Input 3DXML file path")
    parser.add_argument("--output", required=True, help="Output GLB file path")
    parser.add_argument("--stl-dir", default=None, help="Also export individual STL files to this directory")
    parser.add_argument("--debug", action="store_true", help="Enable debug output")
    return parser.parse_args()


# ─── 3DXML ARCHIVE PARSER ───────────────────────────────────────────────────────

class Assembly3DXML:
    """Parse 3DXML archive structure."""

    def __init__(self, filepath):
        self.filepath = filepath
        self.zip = zipfile.ZipFile(filepath)
        self.references = {}      # id -> {name, desc, version, rep_file}
        self.instances = {}       # id -> {name, parent_id, ref_id, matrix}
        self.rep_refs = {}        # id -> {name, file}
        self.instance_reps = {}   # id -> {ref3d_id, rep_id}
        self.root_id = None
        self._parse_assembly()

    def _parse_assembly(self):
        """Parse the main assembly XML file."""
        manifest = ET.fromstring(self.zip.read('Manifest.xml'))
        ns = {'m': 'http://www.3ds.com/xsd/3DXML'}

        # Find root 3dxml file
        root_el = manifest.find('.//Root')
        if root_el is None:
            root_el = manifest.find('{http://www.3ds.com/xsd/3DXML}Root')
        if root_el is None:
            # Try without namespace
            for child in manifest:
                if 'Root' in child.tag:
                    root_el = child
                    break

        root_file = root_el.text if root_el is not None else None
        if not root_file:
            # Find the .3dxml file in the archive
            for name in self.zip.namelist():
                if name.endswith('.3dxml'):
                    root_file = name
                    break

        print(f"[INFO] Assembly file: {root_file}")
        data = self.zip.read(root_file).decode('utf-8')
        root = ET.fromstring(data)

        # Extract namespace
        tag = root.tag
        ns_uri = ''
        if '{' in tag:
            ns_uri = tag.split('}')[0] + '}'

        # Parse ProductStructure
        ps = root.find(f'{ns_uri}ProductStructure')
        if ps is None:
            for child in root:
                if 'ProductStructure' in child.tag:
                    ps = child
                    break

        if ps is None:
            print("[ERROR] No ProductStructure found in assembly")
            return

        # Get root attribute
        self.root_id = ps.get('root', '1')

        for elem in ps:
            tag_local = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
            elem_id = elem.get('id')
            elem_name = elem.get('name', '')

            if tag_local == 'Reference3D':
                ref = {'name': elem_name, 'id': elem_id}
                for child in elem:
                    ctag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                    if ctag == 'V_description':
                        ref['desc'] = child.text
                    elif ctag == 'V_Name':
                        ref['vname'] = child.text
                self.references[elem_id] = ref

            elif tag_local == 'Instance3D':
                inst = {'name': elem_name, 'id': elem_id}
                for child in elem:
                    ctag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                    if ctag == 'IsAggregatedBy':
                        inst['parent_id'] = child.text.strip()
                    elif ctag == 'IsInstanceOf':
                        inst['ref_id'] = child.text.strip()
                    elif ctag == 'RelativeMatrix':
                        inst['matrix'] = self._parse_matrix(child.text.strip())
                self.instances[elem_id] = inst

            elif tag_local == 'ReferenceRep':
                rep = {
                    'name': elem_name,
                    'id': elem_id,
                    'file': elem.get('associatedFile', '').replace('urn:3DXML:', ''),
                    'format': elem.get('format', ''),
                }
                self.rep_refs[elem_id] = rep

            elif tag_local == 'InstanceRep':
                irep = {'id': elem_id, 'name': elem_name}
                for child in elem:
                    ctag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                    if ctag == 'IsAggregatedBy':
                        irep['ref3d_id'] = child.text.strip()
                    elif ctag == 'IsInstanceOf':
                        irep['rep_id'] = child.text.strip()
                self.instance_reps[elem_id] = irep

        print(f"[INFO] Assembly: {len(self.references)} references, "
              f"{len(self.instances)} instances, "
              f"{len(self.rep_refs)} rep refs")

    def _parse_matrix(self, text):
        """Parse a 12-value RelativeMatrix into a 4x4 numpy matrix."""
        vals = [float(v) for v in text.split()]
        if len(vals) == 12:
            # 3x3 rotation + 3 translation
            # Layout: r11 r12 r13 r21 r22 r23 r31 r32 r33 tx ty tz
            m = np.eye(4)
            m[0, 0], m[0, 1], m[0, 2] = vals[0], vals[1], vals[2]
            m[1, 0], m[1, 1], m[1, 2] = vals[3], vals[4], vals[5]
            m[2, 0], m[2, 1], m[2, 2] = vals[6], vals[7], vals[8]
            m[0, 3], m[1, 3], m[2, 3] = vals[9], vals[10], vals[11]
            return m
        elif len(vals) == 16:
            return np.array(vals).reshape(4, 4)
        else:
            return np.eye(4)

    def get_rep_file(self, ref3d_id):
        """Get the 3DRep filename for a Reference3D id."""
        for irep in self.instance_reps.values():
            if irep.get('ref3d_id') == ref3d_id:
                rep_id = irep.get('rep_id')
                if rep_id in self.rep_refs:
                    return self.rep_refs[rep_id]['file']
        return None

    def get_world_transform(self, instance_id):
        """Compute world transform by walking up the instance tree."""
        transform = np.eye(4)
        visited = set()
        current_id = instance_id

        while current_id and current_id not in visited:
            visited.add(current_id)
            inst = self.instances.get(current_id)
            if inst and 'matrix' in inst:
                transform = inst['matrix'] @ transform
            if inst and 'parent_id' in inst:
                # Find instance that references parent
                parent_ref_id = inst['parent_id']
                found = False
                for iid, idata in self.instances.items():
                    if idata.get('ref_id') == parent_ref_id and iid != current_id:
                        current_id = iid
                        found = True
                        break
                if not found:
                    break
            else:
                break

        return transform

    def build_scene_parts(self):
        """Build list of (name, rep_file, world_transform) for all parts."""
        parts = []

        for inst_id, inst in self.instances.items():
            ref_id = inst.get('ref_id')
            if not ref_id:
                continue

            rep_file = self.get_rep_file(ref_id)
            if not rep_file:
                continue

            ref = self.references.get(ref_id, {})
            name = ref.get('vname') or ref.get('name') or inst.get('name', f'part_{inst_id}')

            # Get transform
            transform = np.eye(4)
            if 'matrix' in inst:
                transform = inst['matrix']

            parts.append({
                'name': name,
                'file': rep_file,
                'transform': transform,
                'inst_id': inst_id,
                'ref_id': ref_id,
            })

        print(f"[INFO] Scene parts with geometry: {len(parts)}")
        return parts

    def read_3drep(self, filename):
        """Read a 3DRep file from the archive."""
        try:
            return self.zip.read(filename)
        except KeyError:
            return None


# ─── V5_CFV3 BINARY TESSELLATION EXTRACTOR ───────────────────────────────────────

class CGRTessellationExtractor:
    """Extract tessellation (vertices) from CATIA V5 CGR/3DRep binary files.
    
    Strategy: The V5_CFV3 binary format stores tessellation in a proprietary
    compressed format. We extract vertex point clouds by scanning for float32
    patterns, then reconstruct surfaces using ConvexHull.
    """

    def __init__(self, debug=False):
        self.debug = debug

    def extract(self, data):
        """
        Extract vertex positions from V5_CFV3 binary data.
        Returns list of meshes, each as {'vertices': np.array, 'faces': np.array}.
        """
        if not data or len(data) < 256:
            return []

        # Verify header
        if data[:7] != b'V5_CFV3':
            return []

        # Find the main vertex block (single best candidate)
        block = self._find_best_vertex_block(data)

        if block is None:
            return []

        vertices = block['vertices']
        n_verts = len(vertices)

        if n_verts < 4:  # Need at least 4 for ConvexHull in 3D
            return []

        # Reconstruct surface using ConvexHull
        try:
            from scipy.spatial import ConvexHull
            hull = ConvexHull(vertices)
            faces = hull.simplices

            return [{
                'vertices': vertices,
                'faces': np.array(faces),
            }]
        except Exception as e:
            if self.debug:
                print(f"  [DEBUG] ConvexHull failed ({n_verts} verts): {e}")
            # Fallback: triangle strip
            if n_verts >= 3:
                faces = self._make_triangle_strip_faces(n_verts)
                return [{'vertices': vertices, 'faces': faces}]
            return []

    def _find_best_vertex_block(self, data):
        """Find the single best vertex block in the binary data."""
        blocks = []
        scan_start = 0x300  # Skip header + FAT + directory + material data

        i = scan_start
        while i < len(data) - 12:
            try:
                x, y, z = struct.unpack_from('<3f', data, i)
            except struct.error:
                i += 4
                continue

            if self._is_geometry_coord(x, y, z):
                block_start = i
                vertices = []
                j = i

                while j + 12 <= len(data):
                    try:
                        vx, vy, vz = struct.unpack_from('<3f', data, j)
                    except struct.error:
                        break

                    if self._is_geometry_coord(vx, vy, vz):
                        vertices.append([vx, vy, vz])
                        j += 12
                    else:
                        break

                n_verts = len(vertices)

                if n_verts >= 12:  # Minimum 12 vertices for meaningful geometry
                    verts_array = np.array(vertices)
                    spread = np.ptp(verts_array, axis=0)
                    max_spread = np.max(spread)
                    min_spread = np.min(spread)

                    # Filter: must have extent in at least 2 axes (not a line)
                    axes_with_extent = np.sum(spread > 0.05)

                    # Filter: max extent should be < 2000mm for a single part
                    # Filter: ratio of max/min extent should be reasonable (not infinitely thin)
                    if axes_with_extent >= 2 and max_spread < 2000:
                        # Score: prefer blocks with more vertices and reasonable aspect ratio
                        score = n_verts * (1.0 + min_spread / (max_spread + 1e-6))
                        blocks.append({
                            'offset': block_start,
                            'vertices': verts_array,
                            'n_verts': n_verts,
                            'spread': spread,
                            'score': score,
                        })

                i = j if j > i else i + 1
            else:
                i += 1

        if not blocks:
            return None

        # Return the block with the highest score (usually the largest with good aspect)
        blocks.sort(key=lambda b: b['score'], reverse=True)

        if self.debug and blocks:
            b = blocks[0]
            print(f"  [DEBUG] Best block: {b['n_verts']} verts at 0x{b['offset']:04x}, "
                  f"extent: [{b['spread'][0]:.1f}, {b['spread'][1]:.1f}, {b['spread'][2]:.1f}]")

        return blocks[0]

    def _is_geometry_coord(self, x, y, z):
        """Strict check: is this float32 triplet a valid geometry coordinate?"""
        # Must be finite
        if not (math.isfinite(x) and math.isfinite(y) and math.isfinite(z)):
            return False

        # Mechanical part range: ±1000mm (tighter than before)
        limit = 1000.0
        if abs(x) > limit or abs(y) > limit or abs(z) > limit:
            return False

        # Reject very small non-zero values (noise/material data)
        for v in (x, y, z):
            if v != 0 and abs(v) < 1e-6:
                return False

        # Reject values that look like common material/color constants
        # (0.333, 0.5, 0.7, 1.0 patterns)
        nice_vals = {0.0, 0.333, 0.5, 0.7, 1.0, -1.0}
        rounded = tuple(round(v, 2) for v in (x, y, z))
        if all(r in nice_vals for r in rounded):
            return False  # Likely material property, not geometry

        return True

    def _make_triangle_strip_faces(self, n_verts):
        """Generate triangle indices from a triangle strip."""
        if n_verts < 3:
            return np.array([], dtype=np.int32).reshape(0, 3)
        faces = []
        for i in range(n_verts - 2):
            if i % 2 == 0:
                faces.append([i, i + 1, i + 2])
            else:
                faces.append([i, i + 2, i + 1])
        return np.array(faces, dtype=np.int32)


# ─── MESH BUILDER ────────────────────────────────────────────────────────────────

def build_scene_mesh(assembly, extractor, debug=False):
    """Build a combined trimesh Scene from the 3DXML assembly."""
    parts = assembly.build_scene_parts()
    scene = trimesh.Scene()
    stats = {'loaded': 0, 'failed': 0, 'empty': 0, 'total_verts': 0, 'total_faces': 0}

    # Track which rep files we've already processed (avoid duplicates)
    processed_reps = {}

    for part in parts:
        rep_file = part['file']

        # Read and parse the 3DRep file
        if rep_file not in processed_reps:
            data = assembly.read_3drep(rep_file)
            if data is None:
                if debug:
                    print(f"  [SKIP] {rep_file} — file not found in archive")
                stats['failed'] += 1
                continue

            meshes = extractor.extract(data)
            processed_reps[rep_file] = meshes
        else:
            meshes = processed_reps[rep_file]

        if not meshes:
            stats['empty'] += 1
            continue

        # Combine all mesh blocks for this part
        for idx, mesh_data in enumerate(meshes):
            try:
                mesh = trimesh.Trimesh(
                    vertices=mesh_data['vertices'],
                    faces=mesh_data['faces'],
                    process=True,
                )

                if mesh.is_empty:
                    continue

                # Apply part transform
                mesh.apply_transform(part['transform'])

                # Set material color (aluminium)
                mesh.visual = trimesh.visual.ColorVisuals(
                    mesh=mesh,
                    face_colors=np.tile([196, 199, 199, 255], (len(mesh.faces), 1))
                )

                name = f"{part['name']}_{idx}" if len(meshes) > 1 else part['name']
                # Clean name for scene graph
                name = name.replace(' ', '_').replace('-', '_')[:60]
                scene.add_geometry(mesh, node_name=name)

                stats['loaded'] += 1
                stats['total_verts'] += len(mesh.vertices)
                stats['total_faces'] += len(mesh.faces)

            except Exception as e:
                if debug:
                    print(f"  [ERROR] {part['name']}: {e}")
                stats['failed'] += 1

    print(f"\n[INFO] Scene build complete:")
    print(f"  Loaded:  {stats['loaded']} mesh(es)")
    print(f"  Failed:  {stats['failed']}")
    print(f"  Empty:   {stats['empty']}")
    print(f"  Vertices: {stats['total_verts']:,}")
    print(f"  Faces:    {stats['total_faces']:,}")

    return scene, stats


# ─── EXPORT ──────────────────────────────────────────────────────────────────────

def export_glb(scene, output_path):
    """Export trimesh scene to GLB."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)) or '.', exist_ok=True)

    # Export as GLB
    glb_data = scene.export(file_type='glb')

    with open(output_path, 'wb') as f:
        f.write(glb_data)

    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"[OK] Exported GLB: {output_path} ({size_mb:.2f} MB)")


def export_stl_parts(assembly, extractor, stl_dir, debug=False):
    """Export each part as individual STL file."""
    os.makedirs(stl_dir, exist_ok=True)
    parts = assembly.build_scene_parts()

    for part in parts:
        data = assembly.read_3drep(part['file'])
        if data is None:
            continue

        meshes = extractor.extract(data)
        if not meshes:
            continue

        for idx, mesh_data in enumerate(meshes):
            try:
                mesh = trimesh.Trimesh(
                    vertices=mesh_data['vertices'],
                    faces=mesh_data['faces'],
                    process=True,
                )
                if mesh.is_empty:
                    continue

                mesh.apply_transform(part['transform'])
                name = part['name'].replace(' ', '_').replace('/', '_')[:50]
                stl_path = os.path.join(stl_dir, f"{name}_{idx}.stl")
                mesh.export(stl_path, file_type='stl')

                if debug:
                    print(f"  [STL] {stl_path}")
            except Exception as e:
                if debug:
                    print(f"  [ERROR] STL export {part['name']}: {e}")


# ─── MAIN ────────────────────────────────────────────────────────────────────────

def main():
    args = parse_args()

    print("=" * 60)
    print("  LLEDO 3D Pipeline — 3DXML to GLB Converter")
    print("=" * 60)
    print(f"  Input:  {args.input}")
    print(f"  Output: {args.output}")
    print("=" * 60)

    # 1. Open 3DXML archive
    if not os.path.exists(args.input):
        print(f"[ERROR] File not found: {args.input}")
        sys.exit(1)

    assembly = Assembly3DXML(args.input)
    extractor = CGRTessellationExtractor(debug=args.debug)

    # 2. Build scene
    scene, stats = build_scene_mesh(assembly, extractor, debug=args.debug)

    if stats['loaded'] == 0:
        print("\n[WARN] No meshes could be extracted from binary 3DRep files.")
        print("       The V5_CFV3 binary format may require FreeCAD for conversion.")
        print("\n  Alternative approach:")
        print("  1. Install FreeCAD: https://www.freecad.org/")
        print("  2. Open the 3DXML file in FreeCAD")
        print("  3. Export as STEP or STL")
        print("  4. Use the Blender script with the exported file:")
        print("     blender --background --python convert_xml_to_glb.py -- --input file.stl --output output.glb")
        sys.exit(1)

    # 3. Export GLB
    export_glb(scene, args.output)

    # 4. Optional: Export individual STL parts
    if args.stl_dir:
        print(f"\n[INFO] Exporting individual STL files to: {args.stl_dir}")
        export_stl_parts(assembly, extractor, args.stl_dir, debug=args.debug)

    print("\n[DONE] Pipeline complete.")
    print(f"\n  Next step (optional): Apply PBR material with Blender:")
    print(f"  blender --background --python convert_xml_to_glb.py -- --input {args.output} --output final.glb")


if __name__ == "__main__":
    main()
