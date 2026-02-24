import pdfplumber
import os

pdf_path = r"d:\MPEB\Page 340-349 - Catalogue Solutions Aéronautiques 2026 FR (003).pdf"
out_dir = r"d:\MPEB\scripts\pdf-extract"
os.makedirs(out_dir, exist_ok=True)

with pdfplumber.open(pdf_path) as pdf:
    # Save all text
    all_text = []
    for i, page in enumerate(pdf.pages):
        text = page.extract_text() or "[No text]"
        all_text.append(f"\n=== PAGE {i+1} ===\n{text}")
    
    with open(os.path.join(out_dir, "all-text.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(all_text))
    print("Text saved to all-text.txt")

# Now extract images using pypdfium2
import pypdfium2 as pdfium

pdf_doc = pdfium.PdfDocument(pdf_path)
img_count = 0
for page_idx in range(len(pdf_doc)):
    page = pdf_doc[page_idx]
    for obj_idx, obj in enumerate(page.get_objects()):
        if obj.type == 1:  # Image type
            try:
                bitmap = obj.get_bitmap()
                pil_img = bitmap.to_pil()
                w, h = pil_img.size
                if w > 80 and h > 80:  # Skip tiny icons
                    img_count += 1
                    fname = f"page{page_idx+1}_img{obj_idx}_{w}x{h}.png"
                    pil_img.save(os.path.join(out_dir, fname))
                    print(f"Saved: {fname}")
            except Exception as e:
                pass

print(f"\nTotal images extracted: {img_count}")
