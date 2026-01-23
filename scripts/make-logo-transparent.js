const sharp = require('sharp')
const path = require('path')

async function main() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo1.png')
  const outputPath = path.join(__dirname, '..', 'public', 'logo1-transparent.png')

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const out = Buffer.from(data)

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i]
    const g = out[i + 1]
    const b = out[i + 2]

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const range = max - min
    const avg = (r + g + b) / 3

    if (avg >= 250 && range < 30) {
      out[i + 3] = 0
      continue
    }

    if (avg >= 230 && range < 40) {
      const t = Math.min(1, Math.max(0, (250 - avg) / 20))
      const a = Math.round(t * 255)
      out[i + 3] = Math.min(out[i + 3], a)
    }
  }

  await sharp(out, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath)

  process.stdout.write(`Generated: ${outputPath}\n`)
}

main().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`)
  process.exit(1)
})
