import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'
import { serializeUser } from '~/server/utils/serializers'

export default defineEventHandler(async event => {
  await requireAdmin(event)

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          thumbnails: true,
          downloads: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    users: users.map(user => ({
      ...serializeUser(user),
      totalThumbnails: user._count.thumbnails,
      totalDownloads: user._count.downloads
    }))
  }
})
