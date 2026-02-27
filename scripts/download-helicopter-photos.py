import os
import time
import urllib.request
import urllib.parse
import json
import ssl

output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'images', 'aerotools', 'helicopters')
os.makedirs(output_dir, exist_ok=True)

# Each model has a specific Wikimedia Commons search query to find the right helicopter
models = [
    {"id": "h120",    "query": "Eurocopter EC120 Colibri helicopter"},
    {"id": "h125",    "query": "Eurocopter AS350 Ecureuil helicopter"},
    {"id": "h130",    "query": "Eurocopter EC130 helicopter"},
    {"id": "h135",    "query": "Eurocopter EC135 helicopter"},
    {"id": "h145",    "query": "Airbus Helicopters H145 helicopter"},
    {"id": "sa365",   "query": "Aerospatiale SA365 Dauphin helicopter"},
    {"id": "as565",   "query": "Eurocopter AS565 Panther military helicopter"},
    {"id": "sa330",   "query": "Aerospatiale SA330 Puma military helicopter"},
    {"id": "as332",   "query": "Eurocopter AS332 Super Puma helicopter"},
    {"id": "as532",   "query": "Eurocopter AS532 Cougar military helicopter"},
    {"id": "h225",    "query": "Eurocopter EC225 Super Puma helicopter"},
    {"id": "h225m",   "query": "Eurocopter EC725 Caracal military helicopter"},
    {"id": "h215",    "query": "Airbus H215 Super Puma helicopter"},
    {"id": "h160",    "query": "Airbus H160 helicopter"},
    {"id": "h175",    "query": "Airbus H175 helicopter"},
    {"id": "gazelle", "query": "Aerospatiale SA342 Gazelle military helicopter"},
    {"id": "nh90",    "query": "NHIndustries NH90 military helicopter"},
    {"id": "aw139",   "query": "AgustaWestland AW139 helicopter"},
    {"id": "aw109",   "query": "AgustaWestland AW109 helicopter"},
    {"id": "aw119",   "query": "AgustaWestland AW119 Koala helicopter"},
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def search_wikimedia(query):
    """Search Wikimedia Commons for images matching the query."""
    params = urllib.parse.urlencode({
        'action': 'query',
        'generator': 'search',
        'gsrsearch': f'File: {query}',
        'gsrlimit': '5',
        'gsrnamespace': '6',
        'prop': 'imageinfo',
        'iiprop': 'url|size|mime',
        'iiurlwidth': '1024',
        'format': 'json',
    })
    url = f'https://commons.wikimedia.org/w/api.php?{params}'
    
    req = urllib.request.Request(url, headers={
        'User-Agent': 'LledoAerotoolsBot/1.0 (webmaster@mpeb13.com)',
    })
    
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())
    
    pages = data.get('query', {}).get('pages', {})
    
    results = []
    for page_id, page in pages.items():
        imageinfo = page.get('imageinfo', [{}])[0]
        mime = imageinfo.get('mime', '')
        if mime.startswith('image/') and mime != 'image/svg+xml':
            thumb_url = imageinfo.get('thumburl', imageinfo.get('url', ''))
            width = imageinfo.get('thumbwidth', imageinfo.get('width', 0))
            results.append({
                'url': thumb_url,
                'width': width,
                'title': page.get('title', ''),
            })
    
    # Sort by width descending (prefer larger images)
    results.sort(key=lambda x: x['width'], reverse=True)
    return results

def download_image(url, filepath):
    """Download an image from a URL to a file."""
    req = urllib.request.Request(url, headers={
        'User-Agent': 'LledoAerotoolsBot/1.0 (webmaster@mpeb13.com)',
    })
    with urllib.request.urlopen(req, context=ctx) as response:
        with open(filepath, 'wb') as f:
            f.write(response.read())

def main():
    print("Téléchargement des images d'hélicoptères depuis Wikimedia Commons...")
    print(f"Dossier de sortie : {output_dir}\n")
    
    success = 0
    failed = []
    
    for model in models:
        filepath = os.path.join(output_dir, f"{model['id']}.jpg")
        print(f"Recherche pour {model['id']} : '{model['query']}'...")
        
        try:
            results = search_wikimedia(model['query'])
            
            if not results:
                print(f"  ❌ Aucune image trouvée pour {model['id']}")
                failed.append(model['id'])
                continue
            
            # Take the first (largest) result
            best = results[0]
            print(f"  Téléchargement : {best['title']} ({best['width']}px)")
            download_image(best['url'], filepath)
            
            size = os.path.getsize(filepath)
            print(f"  ✅ Sauvegardé : {filepath} ({size} octets)")
            success += 1
            
        except Exception as e:
            print(f"  ❌ Erreur pour {model['id']}: {str(e)}")
            failed.append(model['id'])
        
        time.sleep(1)  # Be nice to the API
    
    print(f"\n{'='*60}")
    print(f"Résultat : {success}/{len(models)} images téléchargées")
    if failed:
        print(f"Échecs : {', '.join(failed)}")
    print(f"Dossier : {output_dir}")

if __name__ == "__main__":
    main()
