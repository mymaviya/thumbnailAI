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

  return {
    status: paid ? 'ready' : 'preview',
    thumbnailId: body.thumbnailId,
    watermark: !paid,
    format,
    downloadUrl: `/downloads/${body.thumbnailId}.${format}`,
    message: paid
      ? 'Watermark-free download placeholder created.'
      : 'Free preview download placeholder created with watermark.'
  }
})
