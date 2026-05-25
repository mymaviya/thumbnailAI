import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  await requireAdmin(event)

  const [totalUsers, totalThumbnails, totalPayments, totalDownloads, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.thumbnail.count(),
    prisma.payment.count(),
    prisma.download.count(),
    prisma.payment.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true }
    })
  ])

  return {
    totalUsers,
    totalThumbnails,
    totalPayments,
    totalDownloads,
    totalRevenue: revenue._sum.amount || 0,
    currency: 'INR'
  }
})
