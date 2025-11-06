const fs = require('fs');
const path = require('path');
const https = require('https');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.blue}
╔══════════════════════════════════════════════════╗
║     🌐 LLEDO Industries - Auto Translation      ║
║       Powered by MyMemory API (100% FREE)       ║
╚══════════════════════════════════════════════════╝
${colors.reset}\n`);

// Chemins des fichiers
const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
const frDir = path.join(localesDir, 'fr');
const enDir = path.join(localesDir, 'en');

// Fonction pour traduire un texte avec MyMemory API
async function translateText(text) {
  return new Promise((resolve, reject) => {
    // URL encode le texte
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=fr|en`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.responseStatus === 200 && response.responseData) {
            resolve(response.responseData.translatedText);
          } else {
            reject(new Error('Translation failed'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Fonction pour traduire récursivement un objet JSON
async function translateObject(obj, depth = 0) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const indent = '  '.repeat(depth); // Définir indent au début
    
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        // Traduire le texte
        const translatedText = await translateText(value);
        translated[key] = translatedText;
        
        // Log avec indentation
        console.log(`${indent}${colors.cyan}•${colors.reset} ${colors.bright}${key}${colors.reset}`);
        console.log(`${indent}  FR: ${colors.yellow}${value.substring(0, 60)}${value.length > 60 ? '...' : ''}${colors.reset}`);
        console.log(`${indent}  EN: ${colors.green}${translatedText.substring(0, 60)}${translatedText.length > 60 ? '...' : ''}${colors.reset}\n`);
        
        // Pause pour respecter les limites de l'API (1 requête toutes les 200ms)
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`${indent}${colors.red}❌ Erreur de traduction pour "${key}": ${error.message}${colors.reset}`);
        translated[key] = value; // Garder l'original en cas d'erreur
      }
    } else if (Array.isArray(value)) {
      // Traduire les tableaux
      const translatedArray = [];
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          translatedArray.push(await translateObject(item, depth + 1));
        } else if (typeof item === 'string' && item.trim() !== '') {
          try {
            const translatedText = await translateText(item);
            translatedArray.push(translatedText);
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            translatedArray.push(item);
          }
        } else {
          translatedArray.push(item);
        }
      }
      translated[key] = translatedArray;
    } else if (typeof value === 'object' && value !== null) {
      // Traduire les objets imbriqués
      translated[key] = await translateObject(value, depth + 1);
    } else {
      // Garder les autres types (nombres, booléens, chaînes vides, etc.)
      translated[key] = value;
    }
  }
  
  return translated;
}

// Fonction pour traduire un fichier JSON
async function translateFile(filename) {
  const frPath = path.join(frDir, filename);
  const enPath = path.join(enDir, filename);
  
  console.log(`${colors.bright}${colors.blue}📄 Traduction : ${filename}${colors.reset}\n`);
  
  try {
    // Lire le fichier français
    const frContent = JSON.parse(fs.readFileSync(frPath, 'utf8'));
    
    // Traduire
    const enContent = await translateObject(frContent);
    
    // Écrire le fichier anglais
    fs.writeFileSync(enPath, JSON.stringify(enContent, null, 2) + '\n', 'utf8');
    
    console.log(`${colors.green}✅ ${filename} traduit avec succès !${colors.reset}\n`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Erreur pour ${filename}: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Fonction principale
async function main() {
  try {
    console.log(`${colors.bright}🆓 MyMemory Translation API${colors.reset}`);
    console.log(`  • ${colors.green}100% gratuit${colors.reset}`);
    console.log(`  • ${colors.cyan}10 000 mots/jour${colors.reset} sans inscription`);
    console.log(`  • ${colors.yellow}Aucune clé API nécessaire${colors.reset}\n`);
    
    // Lire tous les fichiers JSON dans le dossier français
    const files = fs.readdirSync(frDir).filter(f => f.endsWith('.json'));
    
    console.log(`${colors.bright}Fichiers à traduire : ${files.length}${colors.reset}\n`);
    files.forEach(f => console.log(`  • ${f}`));
    console.log('');
    
    // Demander confirmation
    console.log(`${colors.yellow}⏱️  Temps estimé : ~${Math.ceil(files.length * 2)} minutes${colors.reset}`);
    console.log(`${colors.cyan}💡 L'API est gratuite mais limitée à ~5 requêtes/seconde${colors.reset}\n`);
    
    // Traduire chaque fichier
    let successCount = 0;
    for (const file of files) {
      const success = await translateFile(file);
      if (success) successCount++;
      
      // Pause entre les fichiers
      if (files.indexOf(file) < files.length - 1) {
        console.log(`${colors.yellow}⏸️  Pause de 2 secondes...${colors.reset}\n`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Résumé
    console.log(`${colors.bright}${colors.green}
╔══════════════════════════════════════════════════╗
║              ✅ TRADUCTION TERMINÉE              ║
╚══════════════════════════════════════════════════╝
${colors.reset}`);
    console.log(`${colors.green}✅ ${successCount}/${files.length} fichiers traduits avec succès !${colors.reset}\n`);
    
    if (successCount < files.length) {
      console.log(`${colors.yellow}⚠️  ${files.length - successCount} fichier(s) avec erreurs${colors.reset}\n`);
    }
    
    console.log(`${colors.cyan}💡 Les traductions sont dans : ${enDir}${colors.reset}\n`);
    console.log(`${colors.bright}🎯 MyMemory API - 100% gratuit, 0€/mois !${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}❌ ERREUR FATALE : ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

// Lancer le script
main();
