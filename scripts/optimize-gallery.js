const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const GALLERY = 'd:/MPEB/public/images/gallery'
const MAX_WIDTH = 1600
const QUALITY = 80

async function optimize() {
  const dirs = fs.readdirSync(GALLERY).filter(f => fs.statSync(path.join(GALLERY, f)).isDirectory())
  let totalBefore = 0, totalAfter = 0

  for (const dir of dirs) {
    const dirPath = path.join(GALLERY, dir)
    const files = fs.readdirSync(dirPath).filter(f => /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(f))

    for (const file of files) {
      const src = path.join(dirPath, file)
      const sizeBefore = fs.statSync(src).size
      totalBefore += sizeBefore

      const ext = path.extname(file).toLowerCase()
      const baseName = path.basename(file, path.extname(file))
      const destFile = baseName + '.webp'
      const dest = path.join(dirPath, destFile)

      try {
        await sharp(src)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(dest)

        const sizeAfter = fs.statSync(dest).size
        totalAfter += sizeAfter

        // Remove original if webp was created with different name
        if (destFile !== file) {
          fs.unlinkSync(src)
        }

        const saved = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0)
        console.log(`  ${dir}/${file} → ${destFile} (${(sizeBefore/1024).toFixed(0)}KB → ${(sizeAfter/1024).toFixed(0)}KB, -${saved}%)`)
      } catch (err) {
        console.error(`  ✗ ${dir}/${file}: ${err.message}`)
        totalAfter += sizeBefore
      }
    }
  }

  console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)} MB → ${(totalAfter/1024/1024).toFixed(1)} MB (-${((1-totalAfter/totalBefore)*100).toFixed(0)}%)`)
}

optimize().catch(console.error)
