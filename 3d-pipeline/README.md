# LLEDO 3D Pipeline — XML to GLB + Viewer

## Architecture

```
3d-pipeline/
├── convert_xml_to_glb.py   # Script Blender (CLI)
├── viewer.html              # Viewer Three.js standalone
├── README.md                # Ce fichier
├── [votre_fichier].xml      # Fichier source à convertir
└── output.glb               # Fichier généré (après conversion)
```

## 1. Conversion XML → GLB (Blender)

### Prérequis
- **Blender 3.6+** installé (avec `blender` dans le PATH)

### Formats supportés (auto-détection)
- **COLLADA** (.dae) — Standard industriel
- **X3D** (.x3d) — Web3D
- **XML générique** — Détection automatique par contenu

### Commande

```bash
blender --background --python convert_xml_to_glb.py -- --input fichier.xml --output output.glb
```

### Options

| Argument | Default | Description |
|----------|---------|-------------|
| `--input` | *(requis)* | Chemin du fichier XML/DAE/X3D |
| `--output` | *(requis)* | Chemin de sortie GLB |
| `--metallic` | `1.0` | Valeur métallique (0–1) |
| `--roughness` | `0.3` | Rugosité (0–1) |
| `--draco` | `true` | Compression Draco activée |

### Ce que fait le script

1. **Détecte** le format XML (COLLADA, X3D, ou générique)
2. **Importe** tous les composants de l'assemblage
3. **Nettoie** la géométrie :
   - Supprime les vertices doublons (merge by distance ≤ 0.0001)
   - Recalcule les normales (faces vers l'extérieur)
   - Applique les transformations (location, rotation, scale)
   - Active le smooth shading
4. **Applique** un matériau PBR aluminium brossé :
   - Base Color : gris aluminium (0.77, 0.78, 0.78)
   - Metallic : 1.0
   - Roughness : 0.3 (avec variation procédurale via noise)
5. **Exporte** en GLB avec compression Draco (niveau 6)

---

## 2. Viewer Three.js

### Lancement

Servez le dossier `3d-pipeline/` avec un serveur HTTP local :

```bash
# Python
cd 3d-pipeline
python -m http.server 8080

# ou Node.js
npx serve 3d-pipeline -p 8080
```

Puis ouvrez : **http://localhost:8080/viewer.html**

### Fonctionnalités

- **Chargement sécurisé** : GLB chargé via `fetch()` avec token `Authorization: Bearer`
- **Contrôles** :
  - 🖱️ Clic gauche : rotation orbitale
  - 🔄 Scroll : zoom
  - 🖱️ Clic milieu / droit : pan
- **Éclairage 3-point** optimisé métal :
  - Key light chaud (blanc chaud, forte)
  - Fill light froide (bleu clair, douce)
  - Rim light accent (bleu LLEDO)
  - Ambient + Hemisphere pour le fill naturel
- **Fond sombre** industriel avec gradient
- **Stats** : nombre de composants, triangles, taille fichier
- **Protection** :
  - Clic droit désactivé
  - Ctrl+S / Ctrl+U bloqués
  - Drag & drop désactivé

### Configuration

Dans `viewer.html`, modifiez ces constantes :

```javascript
const GLB_URL = './output.glb';           // Chemin du GLB
const AUTH_TOKEN = 'votre-token-ici';     // Token d'authentification
```

---

## Workflow complet

```bash
# 1. Convertir le XML en GLB
blender --background --python convert_xml_to_glb.py -- --input assemblage.xml --output output.glb

# 2. Lancer le viewer
python -m http.server 8080

# 3. Ouvrir dans le navigateur
# http://localhost:8080/viewer.html
```
