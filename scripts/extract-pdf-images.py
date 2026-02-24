import pdfplumber
import fitz  # PyMuPDF
import os

pdf_path = r"d:\MPEB\Page 340-349 - Catalogue Solutions Aéronautiques 2026 FR (003).pdf"
out_dir = r"d:\MPEB\scripts\pdf-extract"
os.makedirs(out_dir, exist_ok=True)

# Try PyMuPDF for image extraction
doc = fitz.open(pdf_path)
img_count = 0
for page_idx in range(len(doc)):
    page = doc[page_idx]
    images = page.get_images(full=True)
    for img_idx, img_info in enumerate(images):
        xref = img_info[0]
        try:
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            ext = base_image["ext"]
            w = base_image["width"]
            h = base_image["height"]
            if w > 60 and h > 60:
                img_count += 1
                fname = f"p{page_idx+1}_i{img_idx}_{w}x{h}.{ext}"
                with open(os.path.join(out_dir, fname), "wb") as f:
                    f.write(image_bytes)
                print(f"Saved: {fname}")
        except Exception as e:
            print(f"Error page {page_idx+1} img {img_idx}: {e}")

print(f"\nTotal: {img_count} images")
