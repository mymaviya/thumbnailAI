import type { H3Event } from 'h3'
import { PaymentStatus } from '@prisma/client'
import { prisma } from './prisma'
import { requireUser } from './auth'

export const requirePaidThumbnailOwner = async (event: H3Event, thumbnailId: string) => {
  const user = await requireUser(event)
  const thumbnail = await prisma.thumbnail.findFirst({
    where: {
      id: thumbnailId,
      userId: user.id
    }
  })

  if (!thumbnail) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Thumbnail not found.'
    })
  }

  if (thumbnail.paymentStatus !== PaymentStatus.paid) {
    throw createError({
      statusCode: 402,
      statusMessage: 'Payment is required before HD download.'
    })
  }

  return { user, thumbnail }
}
