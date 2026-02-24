import pdfplumber
import json
import os

pdf_path = r"d:\MPEB\Page 340-349 - Catalogue Solutions Aéronautiques 2026 FR (003).pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"=== PDF: {len(pdf.pages)} pages ===\n")
    
    for i, page in enumerate(pdf.pages):
        print(f"\n{'='*60}")
        print(f"PAGE {i+1} (PDF page {page.page_number})")
        print(f"{'='*60}")
        
        # Extract text
        text = page.extract_text()
        if text:
            print(text)
        else:
            print("[No text extracted]")
        
        # Extract tables
        tables = page.extract_tables()
        if tables:
            for j, table in enumerate(tables):
                print(f"\n--- TABLE {j+1} ---")
                for row in table:
                    print(" | ".join([str(cell) if cell else "" for cell in row]))
        
        # List images
        images = page.images
        if images:
            print(f"\n--- {len(images)} IMAGES on this page ---")
            for k, img in enumerate(images):
                print(f"  Image {k+1}: x0={img['x0']:.0f}, y0={img['top']:.0f}, w={img['width']:.0f}, h={img['height']:.0f}")
