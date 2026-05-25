import { prisma } from '~/server/utils/prisma'
import { requireUser } from '~/server/utils/auth'
import { serializeDownload, serializeThumbnail, serializeUser } from '~/server/utils/serializers'

export default defineEventHandler(async event => {
  const user = await requireUser(event)
  const thumbnails = await prisma.thumbnail.findMany({
    where: { userId: user.id },
    include: {
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      downloads: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    user: serializeUser(user),
    thumbnails: thumbnails.map(thumbnail => ({
      ...serializeThumbnail(thumbnail),
      payments: thumbnail.payments,
      downloads: thumbnail.downloads.map(serializeDownload)
    }))
  }
})
