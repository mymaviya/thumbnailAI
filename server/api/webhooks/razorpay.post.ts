import { PaymentStatus, ThumbnailStatus } from '@prisma/client'
import { prisma } from '~/server/utils/prisma'
import { verifyRazorpayWebhookSignature } from '~/server/utils/razorpay'

interface RazorpayWebhookPayload {
  event: string
  payload?: {
    payment?: {
      entity?: {
        id: string
        order_id?: string
        status?: string
      }
    }
  }
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig(event)
  const signature = getHeader(event, 'x-razorpay-signature') || ''
  const rawBody = await readRawBody(event, 'utf8')

  if (!config.razorpayWebhookSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Razorpay webhook secret is not configured.'
    })
  }

  if (!rawBody || !signature || !verifyRazorpayWebhookSignature(rawBody, signature, String(config.razorpayWebhookSecret))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Razorpay webhook signature.'
    })
  }

  const payload = JSON.parse(rawBody) as RazorpayWebhookPayload

  if (payload.event !== 'payment.captured') {
    return { ok: true, ignored: true, event: payload.event }
  }

  const razorpayPaymentId = payload.payload?.payment?.entity?.id
  const razorpayOrderId = payload.payload?.payment?.entity?.order_id

  if (!razorpayPaymentId || !razorpayOrderId) {
    console.warn('Razorpay payment.captured webhook missing payment or order id.')
    return { ok: true, ignored: true }
  }

  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        { razorpayOrderId },
        { razorpayPaymentId }
      ]
    }
  })

  if (!payment) {
    console.warn(`Razorpay webhook received for unknown order ${razorpayOrderId}.`)
    return { ok: true, missingPayment: true }
  }

  const downloadUrl = `/api/downloads/${payment.thumbnailId}`

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'paid',
        razorpayPaymentId
      }
    }),
    prisma.thumbnail.update({
      where: { id: payment.thumbnailId },
      data: {
        paymentStatus: PaymentStatus.paid,
        status: ThumbnailStatus.paid,
        razorpayOrderId,
        razorpayPaymentId
      }
    }),
    prisma.download.upsert({
      where: {
        userId_thumbnailId: {
          userId: payment.userId,
          thumbnailId: payment.thumbnailId
        }
      },
      create: {
        userId: payment.userId,
        thumbnailId: payment.thumbnailId,
        paymentId: payment.id,
        downloadUrl
      },
      update: {
        paymentId: payment.id,
        downloadUrl
      }
    })
  ])

  return { ok: true }
})
