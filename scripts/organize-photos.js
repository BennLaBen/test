const fs = require('fs')
const path = require('path')

const BASE = 'd:/MPEB/public/images'
const GALLERY_DIR = path.join(BASE, 'gallery')

// Product → photo sources mapping
// Each entry: { main: 'folder/file.jpg', gallery: ['folder/file2.jpg', ...] }
const MAPPING = {
  'BR-B160-01': {
    main: '2019-11-22 - BARRE H160/Barre demontable en piste.jpg',
    gallery: [
      '2020-01 - BARRE 160/DSC_0635.JPG',
      '2020-01 - BARRE 160/DSC_0636.JPG',
    ]
  },
  'BR-B160-02': {
    main: '2020-09-18 - BARRES 160-02 et 160-03/IMG_9274.jpg',
    gallery: [
      '2020-09-18 - BARRES 160-02 et 160-03/IMG_9276.jpg',
      '2020-09-18 - BARRES 160-02 et 160-03/IMG_9278.jpg',
    ]
  },
  'BR-B160-03': {
    main: '2020-09-21 - BARRES 160-02 et 160-03/DSC_1144.JPG',
    gallery: [
      '2020-09-21 - BARRES 160-02 et 160-03/DSC_1145.JPG',
      '2020-09-18 - BARRES 160-02 et 160-03/IMG_9281.jpg',
    ]
  },
  'BR-B160-04': {
    main: '2022-05-02 - Photo BARRE 332-03 + Pesee barres/160-01 - 001.jpg',
    gallery: [
      '2022-05-02 - Photo BARRE 332-03 + Pesee barres/160-02 - 001.jpg',
    ]
  },
  'BR-B160-05': {
    main: '2022-09-14 - BARRE 160-05/20220914_115008.JPG',
    gallery: [
      '2022-09-14 - BARRE 160-05/20220914_115014.JPG',
      '2022-09-14 - BARRE 160-05/20220914_115029.JPG',
      '2022-09-14 - BARRE 160-05/20220914_115049.JPG',
      '2025-04-08 - BARRE 160-05/IMG_8733.jpg',
    ]
  },
  'BR-B175-01': {
    main: '2020-03 - BARRE H175/DSC_0669.JPG',
    gallery: [
      '2020-03 - BARRE H175/DSC_0703.JPG',
      '2020-03 - BARRE H175/DSC_0704.JPG',
      '2020-04-15 - BARRE H175/DSC_0699.JPG',
    ]
  },
  'BR-B332-01-000': {
    main: '2019-05-20 - BARRE H332/20190520_143953.jpg',
    gallery: [
      '2019-05-20 - BARRE H332/20190520_144005.jpg',
      '2019-05-20 - BARRE H332/20190520_144134.jpg',
      '2022-05-02 - Photo BARRE 332-03 + Pesee barres/332-01 - 001.jpg',
      '2022-05-02 - Photo BARRE 332-03 + Pesee barres/332-01 - 002.jpg',
    ]
  },
  'BR-B332-03-000': {
    main: '2022-05-02 - Photo BARRE 332-03 + Pesee barres/332-03 - Structure - 001.jpg',
    gallery: [
      '2022-05-02 - Photo BARRE 332-03 + Pesee barres/332-03 - Structure - 002.jpg',
      '2022-05-02 - Photo BARRE 332-03 + Pesee barres/332-03 - Structure - 003.jpg',
    ]
  },
  'BR-NH90-01-000': {
    main: '2022-03-24 - NH90/2022-03-24 - TB-NH90 - Vue 1.jpg',
    gallery: [
      '2022-03-24 - NH90/2022-03-24 - TB-NH90 - Vue 2.jpg',
      '2022-03-24 - NH90/2022-03-24 - TB-NH90 - Vue 3.JPG',
      '2022-03-24 - NH90/2022-03-24 - TB-NH90 - Vue 4.JPG',
    ]
  },
  'BR-NH90-02-000': {
    main: '2022-03-24 - NH90/2022-03-24 - TB-NH90 - Vue 2.jpg',
    gallery: [
      '2022-03-24 - NH90/2022-03-24 - TB-NH90 - Vue 3.JPG',
    ]
  },
  'BR-B365-01-000': {
    main: '2020-10-14 - MUSE ST VICTORET - 365/DSC_1218.JPG',
    gallery: [
      '2020-10-14 - MUSE ST VICTORET - 365/DSC_1219.JPG',
      '2020-10-14 - MUSE ST VICTORET - 365/DSC_1220.JPG',
    ]
  },
  'BR-B365-02-000': {
    main: '2020-10-14 - MUSE ST VICTORET - 365/DSC_1220.JPG',
    gallery: [
      '2020-10-14 - MUSE ST VICTORET - 365/DSC_1221.JPG',
    ]
  },
  'BR-BHHL-01-000': {
    main: '2023-09-14 - Barre HL chez RTE/20230913_103429.JPG',
    gallery: [
      '2025-02-19 - BARRE HL/IMG_7267.jpg',
      '2024-03-13 - BARRE HL chez BAKOC/20240313_144715.JPG',
      '2023-09-14 - Barre HL chez RTE/20230913_103437.JPG',
      '2023-09-14 - Barre HL chez RTE/20230913_103447.JPG',
    ]
  },
  'BR-B139-01-000': {
    main: '2026-01-15 - TALLARD - TBHL-01 + AGUSTA AW139/20260115_115530.JPG',
    gallery: [
      '2026-01-15 - TALLARD - TBHL-01 + AGUSTA AW139/20260115_115534.JPG',
      '2026-01-15 - TALLARD - TBHL-01 + AGUSTA AW139/20260115_115538.JPG',
    ]
  },
  'BR-COO16-01-K01': {
    main: '2022-03-06 - Anneau de reduction/20230306_100020.JPG',
    gallery: [
      '2022-03-06 - Anneau de reduction/20230306_100026.JPG',
      '2022-03-06 - Anneau de reduction/20230306_100029.JPG',
    ]
  },
}

// Products that keep their existing SVG/PNG (no real photos available)
const KEEP_EXISTING = [
  'BR-B330-01-000',  // Puma — no real photos found
  'BR-BHHL-OP3',     // Ballast option
  'BR-BHHL-OP4',     // Support rollers option
  'RL-R125-02-000',  // Roller H125 Hydraulique
  'RL-R130-02-000',  // Roller H130 Hydraulique
  'RL-RGAZ-02-000',  // Roller Gazelle Hydraulique
  'RL-R125-03-000',  // Roller EC120/H125 Petites Roues
  'RL-R125-04-000',  // Roller H125 Mécanique
]

// Step 1: Create gallery directories and copy photos
console.log('=== ORGANIZING PRODUCT PHOTOS ===\n')

let results = {}

for (const [productId, sources] of Object.entries(MAPPING)) {
  const slug = productId.toLowerCase()
  const destDir = path.join(GALLERY_DIR, slug)
  fs.mkdirSync(destDir, { recursive: true })

  let mainPath = null
  const galleryPaths = []
  let idx = 1

  // Copy main image
  const mainSrc = path.join(BASE, sources.main)
  if (fs.existsSync(mainSrc)) {
    const ext = path.extname(sources.main).toLowerCase()
    const destFile = `main${ext}`
    fs.copyFileSync(mainSrc, path.join(destDir, destFile))
    mainPath = `/images/gallery/${slug}/${destFile}`
    console.log(`✓ ${productId} main: ${sources.main}`)
  } else {
    console.log(`✗ ${productId} main MISSING: ${sources.main}`)
  }

  // Copy gallery images
  for (const g of sources.gallery) {
    const gSrc = path.join(BASE, g)
    if (fs.existsSync(gSrc)) {
      const ext = path.extname(g).toLowerCase()
      const destFile = `${String(idx).padStart(2, '0')}${ext}`
      fs.copyFileSync(gSrc, path.join(destDir, destFile))
      galleryPaths.push(`/images/gallery/${slug}/${destFile}`)
      idx++
    } else {
      console.log(`  ✗ gallery MISSING: ${g}`)
    }
  }

  results[productId] = { image: mainPath, gallery: galleryPaths }
}

// Step 2: Update products.json
console.log('\n=== UPDATING PRODUCTS.JSON ===\n')

const productsPath = 'd:/MPEB/src/data/shop/products.json'
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))

for (const p of products) {
  if (results[p.id]) {
    const r = results[p.id]
    if (r.image) {
      p.image = r.image
      console.log(`${p.id}: image → ${r.image}`)
    }
    if (r.gallery.length > 0) {
      p.gallery = r.gallery
      console.log(`${p.id}: gallery → ${r.gallery.length} photos`)
    }
  } else if (KEEP_EXISTING.includes(p.id)) {
    console.log(`${p.id}: KEEPING existing image (${p.image})`)
  } else {
    console.log(`${p.id}: NO MAPPING — keeping as-is`)
  }
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8')
console.log('\n✓ products.json updated!')
console.log('\nDone. Run the seed API to push to production DB.')
