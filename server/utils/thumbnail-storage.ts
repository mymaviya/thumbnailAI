import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const privateRoot = join(process.cwd(), '.storage', 'thumbnails')
const publicRoot = join(process.cwd(), 'public', 'uploads', 'thumbnails')

const parseDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/)
  if (!match) return null

  return {
    extension: match[1] === 'jpeg' ? 'jpg' : match[1],
    buffer: Buffer.from(match[2], 'base64')
  }
}

export const saveGeneratedThumbnailFiles = async (thumbnailId: string, imageDataUrl: string) => {
  const parsed = parseDataUrl(imageDataUrl)

  if (!parsed) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Image generation did not return a storable image.'
    })
  }

  await mkdir(privateRoot, { recursive: true })
  await mkdir(publicRoot, { recursive: true })

  const image = await sharp(parsed.buffer).resize(1280, 720, { fit: 'cover' }).png().toBuffer()
  const originalPath = join(privateRoot, `${thumbnailId}.png`)
  const watermarkedPath = join(publicRoot, `${thumbnailId}-watermarked.png`)
  const watermark = Buffer.from(`
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="transparent"/>
      <g transform="rotate(-18 640 360)">
        <rect x="370" y="305" width="540" height="110" rx="14" fill="rgba(0,0,0,0.42)"/>
        <text x="640" y="375" text-anchor="middle" font-size="54" font-family="Arial, sans-serif" font-weight="800" fill="white" letter-spacing="10">PREVIEW</text>
      </g>
    </svg>
  `)
  const watermarked = await sharp(image)
    .composite([{ input: watermark, top: 0, left: 0 }])
    .png()
    .toBuffer()

  await writeFile(originalPath, image)
  await writeFile(watermarkedPath, watermarked)

  return {
    privatePath: originalPath,
    imageUrl: `local:${thumbnailId}.png`,
    watermarkedImageUrl: `/uploads/thumbnails/${thumbnailId}-watermarked.png`
  }
}

export const getPrivateThumbnailPath = (thumbnailId: string) => join(privateRoot, `${thumbnailId}.png`)
