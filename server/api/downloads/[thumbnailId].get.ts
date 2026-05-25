import { existsSync, createReadStream } from 'node:fs'
import { PaymentStatus, ThumbnailStatus } from '@prisma/client'
import { prisma } from '~/server/utils/prisma'
import { requirePaidThumbnailOwner } from '~/server/utils/downloads'
import { getPrivateThumbnailPath } from '~/server/utils/thumbnail-storage'

export default defineEventHandler(async event => {
  const thumbnailId = String(getRouterParam(event, 'thumbnailId') || '')

  if (!thumbnailId) {
    throw createError({
      statusCode: 422,
      statusMessage: 'thumbnailId is required.'
    })
  }

  const { user, thumbnail } = await requirePaidThumbnailOwner(event, thumbnailId)
  const filePath = getPrivateThumbnailPath(thumbnail.id)

  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'HD thumbnail file is unavailable.'
    })
  }

  await prisma.$transaction([
    prisma.download.upsert({
      where: {
        userId_thumbnailId: {
          userId: user.id,
          thumbnailId: thumbnail.id
        }
      },
      create: {
        userId: user.id,
        thumbnailId: thumbnail.id,
        downloadUrl: `/api/downloads/${thumbnail.id}`,
        downloadedAt: new Date()
      },
      update: {
        downloadedAt: new Date(),
        downloadUrl: `/api/downloads/${thumbnail.id}`
      }
    }),
    prisma.thumbnail.update({
      where: { id: thumbnail.id },
      data: {
        status: ThumbnailStatus.downloaded,
        paymentStatus: PaymentStatus.paid
      }
    })
  ])

  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Content-Disposition', `attachment; filename="${thumbnail.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${thumbnail.id}.png"`)
  setHeader(event, 'Cache-Control', 'private, no-store')

  return sendStream(event, createReadStream(filePath))
})
