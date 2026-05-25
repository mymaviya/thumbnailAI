interface DownloadBody {
  thumbnailId: string
  paid?: boolean
  format?: 'png' | 'jpg'
}

export default defineEventHandler(async event => {
  const body = await readBody<DownloadBody>(event)

  if (!body.thumbnailId) {
    throw createError({
      statusCode: 422,
      statusMessage: 'thumbnailId is required.'
    })
  }

  const format = body.format || 'png'
  const paid = Boolean(body.paid)

  if (paid) {
    throw createError({
      statusCode: 410,
      statusMessage: 'Paid HD downloads must use the authenticated /api/downloads/:thumbnailId route.'
    })
  }

  return {
    status: 'preview',
    thumbnailId: body.thumbnailId,
    watermark: true,
    format,
    downloadUrl: `/downloads/${body.thumbnailId}.${format}`,
    message: 'Watermarked preview download created. Complete payment to unlock HD without watermark.'
  }
})
