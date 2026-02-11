const fs = require('fs');

const helicopters = [
  { id: 'h160', name: 'H160', manufacturer: 'AIRBUS HELICOPTERS', color: '#2563eb', accent: '#60a5fa', silhouette: 'M150,280 Q160,240 200,220 L260,210 Q280,208 300,210 L380,215 Q400,216 420,220 L480,240 Q500,250 510,260 L520,270 Q525,280 520,285 L480,290 Q460,292 440,290 L400,285 Q380,283 360,285 L320,290 Q300,292 280,290 L220,285 Q200,283 180,285 L160,288 Q152,290 150,285 Z M300,210 L310,180 Q315,170 320,175 L340,200 M420,220 L500,215 Q520,214 530,218 L560,230 Q570,235 565,240 L530,245 Q520,247 510,245 L480,240 M200,220 L180,215 Q170,213 165,218 L158,230' },
  { id: 'h175', name: 'H175', manufacturer: 'AIRBUS HELICOPTERS', color: '#1d4ed8', accent: '#93c5fd', silhouette: 'M130,280 Q140,235 185,215 L270,205 Q295,203 320,205 L410,210 Q435,212 450,218 L510,245 Q530,255 535,265 L540,275 Q542,282 538,286 L500,292 Q480,294 460,292 L410,287 Q390,285 370,287 L330,292 Q310,294 290,292 L230,287 Q210,285 190,287 L160,290 Q140,292 135,287 Z M320,205 L332,170 Q338,158 344,165 L360,195 M450,218 L540,210 Q565,208 575,215 L600,232 Q608,238 602,244 L565,250 Q555,252 545,248 L510,240 M185,215 L162,210 Q150,208 146,214 L140,228' },
  { id: 'nh90', name: 'NH90', manufacturer: 'NH INDUSTRIES', color: '#4b5563', accent: '#9ca3af', silhouette: 'M120,285 Q130,235 180,210 L280,198 Q310,196 340,198 L440,205 Q470,208 490,218 L550,248 Q572,260 575,272 L578,282 Q580,290 574,294 L530,300 Q508,302 486,300 L430,295 Q408,293 386,295 L340,300 Q318,302 296,300 L230,295 Q208,293 186,295 L155,298 Q135,300 130,294 Z M340,198 L354,158 Q360,145 368,152 L388,190 M490,218 L585,208 Q612,206 624,214 L656,235 Q665,242 658,249 L618,256 Q607,258 596,254 L550,244 M180,210 L154,204 Q140,202 136,208 L128,225' },
  { id: 'super-puma', name: 'SUPER PUMA', manufacturer: 'AIRBUS HELICOPTERS', color: '#b45309', accent: '#fbbf24', silhouette: 'M110,290 Q120,230 175,205 L290,190 Q325,188 360,190 L470,198 Q500,200 525,212 L595,248 Q620,262 625,275 L628,286 Q630,295 623,300 L575,306 Q550,308 525,306 L460,300 Q435,298 410,300 L360,306 Q335,308 310,306 L240,300 Q215,298 190,300 L150,304 Q128,306 122,300 Z M360,190 L375,145 Q382,130 390,138 L412,182 M525,212 L625,200 Q655,198 668,207 L705,232 Q715,240 708,248 L665,256 Q652,258 640,254 L595,242 M175,205 L148,198 Q132,196 128,203 L118,222' },
  { id: 'gazelle', name: 'GAZELLE', manufacturer: 'AÉROSPATIALE', color: '#047857', accent: '#6ee7b7', silhouette: 'M170,275 Q178,245 210,228 L280,218 Q300,216 320,218 L380,222 Q398,224 410,230 L460,252 Q478,262 482,270 L485,278 Q486,284 482,287 L455,292 Q438,294 422,292 L380,288 Q362,286 345,288 L310,292 Q292,294 275,292 L225,288 Q208,286 192,288 L178,290 Q170,292 168,287 Z M320,218 L330,192 Q334,183 340,188 L354,212 M410,230 L485,224 Q505,222 514,228 L540,244 Q548,250 543,255 L515,260 Q505,262 496,258 L460,248 M210,228 L192,224 Q182,222 180,228 L175,240' },
  { id: 'h125', name: 'H125', manufacturer: 'AIRBUS HELICOPTERS', color: '#0e7490', accent: '#67e8f9', silhouette: 'M165,278 Q174,248 208,230 L278,220 Q298,218 318,220 L378,224 Q396,226 408,232 L458,254 Q475,264 478,272 L482,280 Q483,286 479,289 L452,294 Q435,296 418,294 L378,290 Q360,288 342,290 L308,294 Q290,296 272,294 L222,290 Q205,288 188,290 L175,292 Q167,294 165,289 Z M318,220 L328,194 Q332,185 338,190 L352,214 M408,232 L482,226 Q502,224 512,230 L538,246 Q546,252 541,257 L512,262 Q502,264 493,260 L458,250 M208,230 L190,226 Q180,224 178,230 L173,242' },
  { id: 'h130', name: 'H130', manufacturer: 'AIRBUS HELICOPTERS', color: '#7c3aed', accent: '#c4b5fd', silhouette: 'M162,278 Q171,246 206,228 L278,218 Q298,216 318,218 L380,222 Q398,224 410,230 L462,254 Q480,264 484,272 L487,280 Q488,286 484,289 L455,294 Q438,296 420,294 L380,290 Q362,288 344,290 L310,294 Q292,296 274,294 L224,290 Q207,288 190,290 L176,292 Q168,294 166,289 Z M318,218 L328,190 Q332,180 338,186 L354,212 M410,230 L488,224 Q508,222 518,228 L545,244 Q554,250 548,256 L518,262 Q508,264 498,260 L462,250 M206,228 L188,224 Q178,222 176,228 L170,242' },
];

helicopters.forEach(h => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="sky-${h.id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#030712"/>
      <stop offset="40%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="glow-${h.id}" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="${h.color}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${h.color}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spot-${h.id}" cx="0.5" cy="0.6" r="0.5">
      <stop offset="0%" stop-color="${h.color}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${h.color}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow-${h.id}">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="${h.color}" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="500" fill="url(#sky-${h.id})"/>
  <rect width="800" height="500" fill="url(#glow-${h.id})"/>
  <ellipse cx="400" cy="320" rx="350" ry="180" fill="url(#spot-${h.id})"/>

  <!-- Grid lines -->
  <line x1="0" y1="380" x2="800" y2="380" stroke="${h.color}" stroke-width="0.5" opacity="0.15"/>
  <line x1="0" y1="420" x2="800" y2="420" stroke="${h.color}" stroke-width="0.3" opacity="0.08"/>

  <!-- HUD corners -->
  <polyline points="30,30 30,70 70,70" fill="none" stroke="${h.accent}" stroke-width="1.5" opacity="0.4"/>
  <polyline points="770,30 770,70 730,70" fill="none" stroke="${h.accent}" stroke-width="1.5" opacity="0.4"/>
  <polyline points="30,470 30,430 70,430" fill="none" stroke="${h.accent}" stroke-width="1.5" opacity="0.4"/>
  <polyline points="770,470 770,430 730,430" fill="none" stroke="${h.accent}" stroke-width="1.5" opacity="0.4"/>

  <!-- Helicopter silhouette -->
  <g transform="translate(50,30) scale(1.05)" filter="url(#shadow-${h.id})">
    <path d="${h.silhouette}" fill="${h.color}" opacity="0.85" stroke="${h.accent}" stroke-width="1.5"/>
    <!-- Rotor disc -->
    <ellipse cx="340" cy="195" rx="180" ry="8" fill="${h.accent}" opacity="0.15"/>
    <line x1="160" y1="195" x2="520" y2="195" stroke="${h.accent}" stroke-width="1" opacity="0.3"/>
    <!-- Windows -->
    <rect x="220" y="225" width="35" height="25" rx="5" fill="${h.accent}" opacity="0.2"/>
    <rect x="265" y="223" width="35" height="27" rx="5" fill="${h.accent}" opacity="0.2"/>
  </g>

  <!-- Ground reflection -->
  <g transform="translate(50,30) scale(1.05)" opacity="0.06">
    <g transform="translate(0,560) scale(1,-1)">
      <path d="${h.silhouette}" fill="${h.color}"/>
    </g>
  </g>

  <!-- Model name -->
  <text x="400" y="420" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="52" fill="white" letter-spacing="8" opacity="0.95">${h.name}</text>
  
  <!-- Manufacturer -->
  <text x="400" y="450" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="12" fill="${h.accent}" letter-spacing="5" opacity="0.6">${h.manufacturer}</text>

  <!-- LLEDO AERO TOOLS branding top-right -->
  <rect x="590" y="35" width="170" height="28" rx="4" fill="white" opacity="0.9"/>
  <text x="675" y="54" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="11" fill="${h.color}" letter-spacing="2">LLEDO AERO TOOLS</text>

  <!-- Top-left model tag -->
  <rect x="40" y="35" width="80" height="24" rx="4" fill="${h.color}" opacity="0.8"/>
  <text x="80" y="51" text-anchor="middle" font-family="monospace" font-weight="700" font-size="10" fill="white" letter-spacing="1">${h.name}</text>

  <!-- Bottom bar -->
  <rect x="0" y="490" width="800" height="10" fill="${h.color}" opacity="0.6"/>
  <rect x="0" y="0" width="800" height="3" fill="${h.accent}" opacity="0.4"/>

  <!-- Technical data overlay -->
  <text x="50" y="478" font-family="monospace" font-size="9" fill="white" opacity="0.2" letter-spacing="2">COMPATIBLE EQUIPMENT — LLEDO AEROTOOLS GSE CATALOGUE</text>
</svg>`;

  const outPath = `./public/images/aerotools/heli-${h.id}.svg`;
  fs.writeFileSync(outPath, svg);
  console.log(`Created: ${outPath}`);
});
