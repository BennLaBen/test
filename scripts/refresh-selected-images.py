import os
import ssl
import json
import urllib.request
import urllib.parse

# Dossier des images
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "public", "images", "aerotools", "helicopters")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Contexte SSL tolérant (comme dans les autres scripts)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Modèles à rafraîchir avec des requêtes plus précises
MODELS = [
    {
        "id": "h120",
        # Requête plus générique pour avoir plus de résultats
        "query": "Eurocopter EC120 Colibri helicopter",
    },
    {
        "id": "gazelle",
        "query": "Aerospatiale SA342 Gazelle helicopter",
    },
    {
        "id": "h225",
        "query": "Eurocopter EC225 helicopter",
    },
]

# Mots à éviter dans les titres (épaves, dessins techniques, etc.)
AVOID_KEYWORDS = [
    "wreck", "scrap", "derelict", "abandoned", "hulk", "carcass", "wreckage",
    "drawing", "diagram", "3-view", "3 view", "cutaway", "line drawing",
]


def search_wikimedia(query):
    """Recherche d'images sur Wikimedia Commons pour une requête donnée."""
    params = urllib.parse.urlencode({
        "action": "query",
        "generator": "search",
        # Recherche plein texte plus large (titre + description)
        "gsrsearch": query,
        "gsrlimit": "30",
        "gsrnamespace": "6",
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "iiurlwidth": "1200",
        "format": "json",
    })
    url = f"https://commons.wikimedia.org/w/api.php?{params}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "LledoAerotoolsBot/1.0 (webmaster@mpeb13.com)"},
    )

    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())

    pages = data.get("query", {}).get("pages", {})
    results = []

    for _page_id, page in pages.items():
        imageinfo = page.get("imageinfo", [{}])[0]
        mime = imageinfo.get("mime", "")
        title = page.get("title", "")
        lower_title = title.lower()

        # On ne garde que des JPEG photos, pas de SVG/PNG/dessins
        if mime != "image/jpeg":
            continue

        # Filtrer les titres indésirables
        if any(word in lower_title for word in AVOID_KEYWORDS):
            continue

        thumb_url = imageinfo.get("thumburl", imageinfo.get("url", ""))
        width = imageinfo.get("thumbwidth", imageinfo.get("width", 0))

        if thumb_url:
            results.append({
                "title": title,
                "url": thumb_url,
                "width": width,
            })

    # Plus large d'abord
    results.sort(key=lambda x: x["width"], reverse=True)
    return results


def download_image(url, filepath):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "LledoAerotoolsBot/1.0 (webmaster@mpeb13.com)"},
    )
    with urllib.request.urlopen(req, context=ctx) as response:
        content = response.read()
    with open(filepath, "wb") as f:
        f.write(content)


def main():
    print("Rafraîchissement des images h120, gazelle, h225 depuis Wikimedia Commons...")
    print(f"Dossier de sortie : {OUTPUT_DIR}\n")

    for model in MODELS:
        mid = model["id"]
        query = model["query"]
        filepath = os.path.join(OUTPUT_DIR, f"{mid}.jpg")

        print(f"Recherche pour {mid} : '{query}'")
        try:
            results = search_wikimedia(query)
            if not results:
                print(f"  ❌ Aucune image valable trouvée pour {mid}")
                continue

            best = results[0]
            print(f"  Sélection : {best['title']} ({best['width']}px)")
            download_image(best["url"], filepath)
            size = os.path.getsize(filepath)
            print(f"  ✅ Sauvegardé : {filepath} ({size} octets)\n")
        except Exception as e:
            print(f"  ❌ Erreur pour {mid}: {e}\n")

    print("Terminé.")


if __name__ == "__main__":
    main()
