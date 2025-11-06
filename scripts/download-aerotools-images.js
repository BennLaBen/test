// Script pour télécharger les images AEROTOOLS depuis le site LLEDO
// Usage: node scripts/download-aerotools-images.js

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Créer le dossier images/aerotools si il n'existe pas
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'aerotools');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Dossier créé: public/images/aerotools/');
}

// Liste des images à télécharger depuis le site LLEDO
const imagesToDownload = [
  // Barres de remorquage BR-B332
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-B332-1.jpg',
    filename: 'br-b332-01.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-B332-2.jpg',
    filename: 'br-b332-02.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-B332-3.jpg',
    filename: 'br-b332-03.jpg'
  },

  // Barres de remorquage BR-H160
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-B160-01.jpg',
    filename: 'br-h160-01.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-B160-02.jpg',
    filename: 'br-h160-02.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-B160-03.jpg',
    filename: 'br-h160-03.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-B160-04.jpg',
    filename: 'br-h160-04.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-B160-05.jpg',
    filename: 'br-h160-05.jpg'
  },

  // Barres de remorquage BR-NH90
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-NH90-01.jpg',
    filename: 'br-nh90-01.jpg'
  },

  // Barres de remorquage BR-H175
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-H175-01.jpg',
    filename: 'br-h175-01.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-H175-02.jpg',
    filename: 'br-h175-02.jpg'
  },

  // Barres de remorquage BR-BHHL
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/BR-BHHL-01.jpg',
    filename: 'br-bhhl-01.jpg'
  },

  // Rollers RL-R125
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/RL-R125-02.jpg',
    filename: 'rl-r125-02.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/RL-R125-03.jpg',
    filename: 'rl-r125-03.jpg'
  },

  // Rollers RL-R130
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/RL-R130-02.jpg',
    filename: 'rl-r130-02.jpg'
  },

  // Rollers GAZELLE
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/ROLLERS-GAZELLE-02.jpg',
    filename: 'rl-gazelle-02.jpg'
  },
  {
    url: 'https://lledo-industries.com/aerotools/wp-content/uploads/sites/5/2019/05/ROLLERS-GAZELLE-03.jpg',
    filename: 'rl-gazelle-03.jpg'
  },
];

// Fonction pour télécharger une image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    console.log(`📥 Téléchargement: ${path.basename(filepath)}...`);
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      // Suivre les redirections
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Échec: ${response.statusCode} pour ${url}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Téléchargé: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// Télécharger toutes les images
async function downloadAll() {
  console.log('🚀 Début du téléchargement des images AEROTOOLS...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const image of imagesToDownload) {
    const filepath = path.join(imagesDir, image.filename);
    
    // Si l'image existe déjà, on la garde
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Ignoré (existe déjà): ${image.filename}`);
      success++;
      continue;
    }
    
    try {
      await downloadImage(image.url, filepath);
      success++;
    } catch (error) {
      console.error(`❌ Erreur: ${image.filename} - ${error.message}`);
      failed++;
    }
    
    // Petite pause pour ne pas surcharger le serveur
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Téléchargement terminé !`);
  console.log(`📊 Réussis: ${success} | Échecs: ${failed} | Total: ${imagesToDownload.length}`);
  console.log(`📁 Dossier: ${imagesDir}`);
  console.log('='.repeat(50));
}

// Lancer le téléchargement
downloadAll().catch(console.error);

