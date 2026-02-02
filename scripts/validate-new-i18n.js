const fs = require('fs');
const path = require('path');

const localesPath = 'd:/MPEB/src/i18n/locales/';
const files = ['fr.json', 'en.json', 'es.json', 'pt-br.json', 'ar.json'];

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

const allKeys = {};

files.forEach(f => {
  try {
    const data = JSON.parse(fs.readFileSync(localesPath + f, 'utf8'));
    allKeys[f] = getKeys(data);
    console.log(`${f}: ${allKeys[f].length} keys`);
  } catch(e) {
    console.log(`Error reading ${f}: ${e.message}`);
  }
});

console.log('\n--- Validation ---');
const refKeys = allKeys['fr.json'];

files.slice(1).forEach(f => {
  const missing = refKeys.filter(k => !allKeys[f].includes(k));
  const extra = allKeys[f].filter(k => !refKeys.includes(k));
  
  if (missing.length) {
    console.log(`\n${f} MISSING (${missing.length}):`);
    missing.forEach(k => console.log(`  - ${k}`));
  }
  if (extra.length) {
    console.log(`\n${f} EXTRA (${extra.length}):`);
    extra.forEach(k => console.log(`  + ${k}`));
  }
  if (!missing.length && !extra.length) {
    console.log(`${f} ✓ All keys match`);
  }
});

console.log('\n--- Summary ---');
console.log(`Reference (fr.json): ${refKeys.length} keys`);
console.log('All files validated.');
