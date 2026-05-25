import { PaymentStatus, ThumbnailStatus } from '@prisma/client'
import { prisma } from '~/server/utils/prisma'
import { requireUser } from '~/server/utils/auth'
import { verifyRazorpayPaymentSignature } from '~/server/utils/razorpay'

interface VerifyPaymentBody {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  thumbnailId?: string
}

export default defineEventHandler(async event => {
  const user = await requireUser(event)
  const config = useRuntimeConfig(event)
  const body = await readBody<VerifyPaymentBody>(event)

  if (!config.razorpayKeySecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Razorpay secret is not configured.'
    })
  }

  if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Payment verification details are required.'
    })
  }

  const payment = await prisma.payment.findFirst({
    where: {
      razorpayOrderId: body.razorpay_order_id,
      userId: user.id,
      ...(body.thumbnailId ? { thumbnailId: body.thumbnailId } : {})
    }
  })

  if (!payment) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Payment record not found.'
    })
  }

  const verified = verifyRazorpayPaymentSignature(
    body.razorpay_order_id,
    body.razorpay_payment_id,
    body.razorpay_signature,
    String(config.razorpayKeySecret)
  )

  if (!verified) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'failed',
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySignature: body.razorpay_signature
      }
    })

    throw createError({
      statusCode: 400,
      statusMessage: 'Payment verification failed.'
    })
  }

  const downloadUrl = `/api/downloads/${payment.thumbnailId}`

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'paid',
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySignature: body.razorpay_signature
      }
    }),
    prisma.thumbnail.update({
      where: { id: payment.thumbnailId },
      data: {
        paymentStatus: PaymentStatus.paid,
        status: ThumbnailStatus.paid,
        razorpayOrderId: body.razorpay_order_id,
        razorpayPaymentId: body.razorpay_payment_id
      }
    }),
    prisma.download.upsert({
      where: {
        userId_thumbnailId: {
          userId: user.id,
          thumbnailId: payment.thumbnailId
        }
      },
      create: {
        userId: user.id,
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

  return {
    verified: true,
    provider: 'razorpay',
    orderId: body.razorpay_order_id,
    paymentId: body.razorpay_payment_id,
    thumbnailId: payment.thumbnailId,
    downloadUrl
  }
})
