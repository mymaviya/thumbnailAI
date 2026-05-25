import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'
import { serializeDownload } from '~/server/utils/serializers'

export default defineEventHandler(async event => {
  await requireAdmin(event)

  const downloads = await prisma.download.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      thumbnail: {
        include: {
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    downloads: downloads.map(download => ({
      ...serializeDownload(download),
      amount: download.thumbnail.payments[0]?.amount || 0,
      paymentStatus: download.thumbnail.paymentStatus
    }))
  }
})
