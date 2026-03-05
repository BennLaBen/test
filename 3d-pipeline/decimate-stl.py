"""Decimate an STL file to reduce triangle count for WebGL rendering."""
import sys
import os
import trimesh

input_path = sys.argv[1] if len(sys.argv) > 1 else r"d:\MPEB\models\roller-h125.stl"
target_faces = int(sys.argv[2]) if len(sys.argv) > 2 else 200000
output_path = input_path.replace('.stl', f'_decimated.stl')

print(f"Loading STL: {input_path}")
mesh = trimesh.load(input_path)
print(f"Original: {len(mesh.faces):,} faces, {len(mesh.vertices):,} vertices")
print(f"File size: {os.path.getsize(input_path) / 1024 / 1024:.1f} MB")

if len(mesh.faces) <= target_faces:
    print(f"Already under {target_faces:,} faces, skipping.")
    sys.exit(0)

ratio = 1.0 - (target_faces / len(mesh.faces))
print(f"\nDecimating to ~{target_faces:,} faces (reduction: {ratio:.4f})...")

try:
    # Try with face_count (older trimesh)
    simplified = mesh.simplify_quadric_decimation(target_faces)
except (ValueError, TypeError):
    # Use fast_simplification directly with target_reduction
    import fast_simplification
    verts, faces = fast_simplification.simplify(
        mesh.vertices, mesh.faces, target_reduction=ratio
    )
    simplified = trimesh.Trimesh(vertices=verts, faces=faces)
print(f"Result: {len(simplified.faces):,} faces, {len(simplified.vertices):,} vertices")

simplified.export(output_path)
size_mb = os.path.getsize(output_path) / 1024 / 1024
print(f"Saved: {output_path} ({size_mb:.1f} MB)")
