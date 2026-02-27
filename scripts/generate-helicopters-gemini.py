"""
Script de génération d'images d'hélicoptères via l'API Gemini (Google AI).
Génère 20 images d'hélicoptères devant un hangar bleu LLEDO.
"""

import os
import time
import base64
import json
import urllib.request
import urllib.parse
import ssl
from pathlib import Path

# Configuration
BASE_DIR = Path(__file__).parent.parent
OUTPUT_DIR = BASE_DIR / "public" / "images" / "aerotools" / "helicopters" / "gemini"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Clé API depuis l'environnement ou en dur (pour test)
API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Liste des 20 modèles d'hélicoptères
HELICOPTERS = [
    {"id": "h120", "name": "Airbus H120 / EC120 Colibri", "type": "civilian", "desc": "light single-engine"},
    {"id": "h125", "name": "Airbus H125 / AS350 Écureuil", "type": "civilian", "desc": "light utility"},
    {"id": "h130", "name": "Airbus H130 / EC130", "type": "civilian", "desc": "light single-engine touring"},
    {"id": "h135", "name": "Airbus H135 / EC135", "type": "civilian", "desc": "light twin-engine"},
    {"id": "h145", "name": "Airbus H145", "type": "civilian", "desc": "medium twin-engine"},
    {"id": "sa365", "name": "Airbus SA365 Dauphin", "type": "civilian", "desc": "medium twin-engine"},
    {"id": "as565", "name": "Airbus AS565 Panther", "type": "military", "desc": "naval military"},
    {"id": "sa330", "name": "Airbus SA330 Puma", "type": "military", "desc": "medium transport military"},
    {"id": "as332", "name": "Airbus AS332 Super Puma", "type": "civilian", "desc": "heavy transport"},
    {"id": "as532", "name": "Airbus AS532 Cougar", "type": "military", "desc": "military transport"},
    {"id": "h225", "name": "Airbus H225 / EC225 Super Puma", "type": "civilian", "desc": "heavy offshore"},
    {"id": "h225m", "name": "Airbus H225M Caracal", "type": "military", "desc": "military tactical transport"},
    {"id": "h215", "name": "Airbus H215", "type": "civilian", "desc": "heavy utility"},
    {"id": "h160", "name": "Airbus H160", "type": "civilian", "desc": "medium twin-engine modern"},
    {"id": "h175", "name": "Airbus H175", "type": "civilian", "desc": "super-medium offshore"},
    {"id": "gazelle", "name": "Aérospatiale SA341/SA342 Gazelle", "type": "military", "desc": "light attack/reconnaissance"},
    {"id": "nh90", "name": "NHIndustries NH90", "type": "military", "desc": "medium military transport"},
    {"id": "aw139", "name": "Leonardo AW139", "type": "civilian", "desc": "medium twin-engine"},
    {"id": "aw109", "name": "Leonardo AW109", "type": "civilian", "desc": "light twin-engine"},
    {"id": "aw119", "name": "Leonardo AW119 Koala", "type": "civilian", "desc": "light single-engine"},
]

# Contexte SSL
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def generate_prompt(heli):
    """Génère un prompt optimisé pour chaque hélicoptère."""
    if heli["type"] == "military":
        style = "military camouflage paint scheme, tactical equipment visible"
    else:
        style = "sleek white and blue corporate livery, polished finish"
    
    prompt = f"""Generate a highly detailed, photorealistic image of a {heli['name']} helicopter ({heli['desc']}).

The helicopter has a {style}.

It is parked on a concrete tarmac helipad. Directly behind the helicopter is a large modern aviation hangar painted in dark corporate blue color (similar to Airbus corporate blue). The hangar has clean lines and a professional industrial look.

The scene is set on a clear sunny day with soft shadows. The image should look like professional aviation photography, sharp focus, high detail, 16:9 aspect ratio.

Do NOT include any text, watermarks, or logos on the image."""

    return prompt


def call_imagen_api(prompt):
    """Appelle l'API Imagen 4.0 pour générer une image."""
    
    # Endpoint pour Imagen 4.0
    url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:generateImages?key={API_KEY}"
    
    payload = {
        "prompt": prompt,
        "config": {
            "numberOfImages": 1,
            "aspectRatio": "16:9",
            "outputMimeType": "image/png"
        }
    }
    
    data = json.dumps(payload).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
        },
        method="POST"
    )
    
    with urllib.request.urlopen(req, context=ctx, timeout=120) as response:
        result = json.loads(response.read().decode())
    
    return result


def extract_image_from_response(response):
    """Extrait l'image base64 de la réponse Imagen."""
    try:
        # Format Imagen: {"generatedImages": [{"image": {"imageBytes": "..."}}]}
        generated_images = response.get("generatedImages", [])
        if not generated_images:
            # Fallback pour autre format
            candidates = response.get("candidates", [])
            if candidates:
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                for part in parts:
                    if "inlineData" in part:
                        inline_data = part["inlineData"]
                        return {"mime_type": inline_data.get("mimeType", "image/png"), "data": inline_data.get("data", "")}
            return None
        
        image_data = generated_images[0].get("image", {})
        image_bytes = image_data.get("imageBytes", "")
        
        if image_bytes:
            return {"mime_type": "image/png", "data": image_bytes}
        
        return None
    except Exception as e:
        print(f"  Erreur extraction: {e}")
        return None


def save_image(image_data, filepath):
    """Sauvegarde l'image décodée en base64."""
    raw = base64.b64decode(image_data["data"])
    with open(filepath, "wb") as f:
        f.write(raw)
    return len(raw)


def main():
    if not API_KEY:
        print("❌ ERREUR: La variable GEMINI_API_KEY n'est pas définie.")
        print("   Ajoute-la dans ton fichier .env ou exporte-la dans le terminal.")
        return
    
    print("=" * 60)
    print("Génération des images d'hélicoptères via Gemini API")
    print(f"Dossier de sortie: {OUTPUT_DIR}")
    print("=" * 60)
    print()
    
    success = 0
    failed = []
    
    for i, heli in enumerate(HELICOPTERS, 1):
        heli_id = heli["id"]
        filepath = OUTPUT_DIR / f"{heli_id}.png"
        
        # Skip si déjà généré
        if filepath.exists() and filepath.stat().st_size > 50000:
            print(f"[{i:02d}/20] ⏩ {heli['name']} - déjà généré, skip")
            success += 1
            continue
        
        print(f"[{i:02d}/20] 🚁 {heli['name']}...")
        prompt = generate_prompt(heli)
        
        try:
            response = call_imagen_api(prompt)
            image_data = extract_image_from_response(response)
            
            if image_data:
                size = save_image(image_data, filepath)
                print(f"         ✅ Sauvegardé: {filepath.name} ({size:,} octets)")
                success += 1
            else:
                print(f"         ❌ Pas d'image dans la réponse")
                failed.append(heli_id)
        
        except urllib.error.HTTPError as e:
            error_body = e.read().decode() if e.fp else ""
            print(f"         ❌ Erreur HTTP {e.code}: {error_body[:200]}")
            failed.append(heli_id)
        
        except Exception as e:
            print(f"         ❌ Erreur: {e}")
            failed.append(heli_id)
        
        # Pause entre les requêtes pour éviter le rate limiting
        if i < len(HELICOPTERS):
            time.sleep(3)
    
    print()
    print("=" * 60)
    print(f"Résultat: {success}/{len(HELICOPTERS)} images générées")
    if failed:
        print(f"Échecs: {', '.join(failed)}")
    print(f"Dossier: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
