const fs = require('fs');

const products = [
  { file: 'towbar-nh90', name: 'BARRE NH90', ref: 'BR-NH90-01', cat: 'REMORQUAGE', color: '#2563eb' },
  { file: 'towbar-puma', name: 'BARRE SUPER PUMA', ref: 'BR-B332', cat: 'REMORQUAGE', color: '#2563eb' },
  { file: 'towbar-gazelle', name: 'BARRE GAZELLE', ref: 'BR-BHHL-01', cat: 'REMORQUAGE', color: '#2563eb' },
  { file: 'roller-h125', name: 'ROLLERS H125', ref: 'RL-R125', cat: 'MANUTENTION', color: '#0891b2' },
  { file: 'roller-h130', name: 'ROLLERS H130', ref: 'RL-R130-02', cat: 'MANUTENTION', color: '#0891b2' },
  { file: 'roller-gazelle', name: 'ROLLERS GAZELLE', ref: 'RL-GAZELLE', cat: 'MANUTENTION', color: '#0891b2' },
  { file: 'kit-h125', name: 'KIT MAINTENANCE H125', ref: 'MT-KIT-H125', cat: 'MAINTENANCE', color: '#d97706' },
  { file: 'stand-universal', name: 'TRETEAU UNIVERSEL', ref: 'MT-STAND-01', cat: 'MAINTENANCE', color: '#d97706' },
  { file: 'blade-protection', name: 'PROTECTION PALES', ref: 'MT-BLADE-PROT', cat: 'MAINTENANCE', color: '#d97706' },
  { file: 'gpu-28v', name: 'GPU 28V DC', ref: 'GSE-GPU-28V', cat: 'GSE', color: '#7c3aed' },
  { file: 'jack-15t', name: 'VERIN 15T', ref: 'GSE-JACK-15T', cat: 'GSE', color: '#7c3aed' },
];

products.forEach(p => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${p.color}" stop-opacity="0.6"/><stop offset="100%" stop-color="${p.color}" stop-opacity="0.2"/></linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect x="0" y="0" width="800" height="3" fill="${p.color}" opacity="0.5"/>
  <rect x="0" y="597" width="800" height="3" fill="${p.color}" opacity="0.3"/>
  <line x1="30" y1="30" x2="80" y2="30" stroke="${p.color}" stroke-width="2" opacity="0.4"/>
  <line x1="30" y1="30" x2="30" y2="80" stroke="${p.color}" stroke-width="2" opacity="0.4"/>
  <line x1="720" y1="30" x2="770" y2="30" stroke="${p.color}" stroke-width="2" opacity="0.4"/>
  <line x1="770" y1="30" x2="770" y2="80" stroke="${p.color}" stroke-width="2" opacity="0.4"/>
  <line x1="30" y1="570" x2="80" y2="570" stroke="${p.color}" stroke-width="2" opacity="0.4"/>
  <line x1="30" y1="520" x2="30" y2="570" stroke="${p.color}" stroke-width="2" opacity="0.4"/>
  <line x1="720" y1="570" x2="770" y2="570" stroke="${p.color}" stroke-width="2" opacity="0.4"/>
  <line x1="770" y1="520" x2="770" y2="570" stroke="${p.color}" stroke-width="2" opacity="0.4"/>
  <rect x="200" y="180" width="400" height="200" rx="16" fill="url(#acc)" opacity="0.15"/>
  <rect x="200" y="180" width="400" height="200" rx="16" stroke="${p.color}" stroke-width="1" fill="none" opacity="0.3"/>
  <text x="400" y="270" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="28" fill="white" letter-spacing="3">${p.name}</text>
  <text x="400" y="310" text-anchor="middle" font-family="monospace" font-size="14" fill="${p.color}" opacity="0.7">REF: ${p.ref}</text>
  <text x="400" y="350" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="white" opacity="0.3" letter-spacing="4">${p.cat}</text>
  <text x="400" y="540" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="10" fill="white" opacity="0.15" letter-spacing="6">LLEDO AEROTOOLS</text>
</svg>`;
  const outPath = './public/images/products/' + p.file + '.svg';
  fs.writeFileSync(outPath, svg);
  console.log('Created: ' + outPath);
});
