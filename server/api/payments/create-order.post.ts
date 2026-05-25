import { prisma } from '~/server/utils/prisma'
import { requireUser } from '~/server/utils/auth'
import { createRazorpayOrder } from '~/server/utils/razorpay'

interface CreateOrderBody {
  thumbnailId: string
  amount?: number
  currency?: string
  plan?: string
}

const planAmount = (plan?: string, amount?: number) => {
  if (Number.isFinite(amount) && Number(amount) > 0) return Math.round(Number(amount) * 100)
  if (plan === '5 Thumbnail Pack') return 9900
  if (plan === 'Monthly Unlimited') return 29900
  return 4900
}

export default defineEventHandler(async event => {
  const user = await requireUser(event)
  const config = useRuntimeConfig(event)
  const body = await readBody<CreateOrderBody>(event)

  if (!body.thumbnailId) {
    throw createError({
      statusCode: 422,
      statusMessage: 'thumbnailId is required.'
    })
  }

  const thumbnail = await prisma.thumbnail.findFirst({
    where: {
      id: body.thumbnailId,
      userId: user.id
    }
  })

  if (!thumbnail) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Thumbnail not found.'
    })
  }

  const currency = body.currency || 'INR'
  const amount = planAmount(body.plan, body.amount)
  const order = await createRazorpayOrder(event, {
    amount,
    currency,
    receipt: `thumb_${thumbnail.id.slice(0, 24)}`,
    notes: {
      thumbnailId: thumbnail.id,
      userId: user.id,
      plan: body.plan || 'Single Thumbnail'
    }
  })

  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      thumbnailId: thumbnail.id,
      amount: order.amount,
      currency: order.currency,
      status: 'created',
      razorpayOrderId: order.id
    }
  })

  await prisma.thumbnail.update({
    where: { id: thumbnail.id },
    data: {
      razorpayOrderId: order.id
    }
  })

  return {
    orderId: order.id,
    paymentRecordId: payment.id,
    keyId: config.public.razorpayKeyId,
    provider: 'razorpay',
    plan: body.plan || 'Single Thumbnail',
    thumbnailId: thumbnail.id,
    amount: order.amount,
    currency: order.currency,
    status: order.status
  }
})
