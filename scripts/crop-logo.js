const sharp = require('sharp')
const path = require('path')

async function main() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo1-transparent.png')
  const outputPath = path.join(__dirname, '..', 'public', 'logo1-cropped.png')

  await sharp(inputPath)
    .trim({ threshold: 10 })
    .png()
    .toFile(outputPath)

  process.stdout.write(`Generated: ${outputPath}\n`)
}

main().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`)
  process.exit(1)
})
