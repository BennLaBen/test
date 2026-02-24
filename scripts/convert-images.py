from PIL import Image
import os

src = r"d:\MPEB\scripts\pdf-extract"
for f in os.listdir(src):
    if f.endswith('.jpx'):
        try:
            img = Image.open(os.path.join(src, f))
            out = os.path.join(src, f.replace('.jpx', '.png'))
            img.save(out)
            print(f"Converted: {f} -> {os.path.basename(out)} ({img.size[0]}x{img.size[1]})")
        except Exception as e:
            print(f"Failed: {f} - {e}")
