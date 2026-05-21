import { createHmac, timingSafeEqual } from 'node:crypto'

interface VerifyPaymentBody {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  plan?: string
  thumbnailId?: string
}

export default defineEventHandler(async event => {
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

  const payload = `${body.razorpay_order_id}|${body.razorpay_payment_id}`
  const expectedSignature = createHmac('sha256', config.razorpayKeySecret)
    .update(payload)
    .digest('hex')

  const expected = Buffer.from(expectedSignature)
  const received = Buffer.from(body.razorpay_signature)
  const verified = expected.length === received.length && timingSafeEqual(expected, received)

  if (!verified) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment verification failed.'
    })
  }

  return {
    verified: true,
    provider: 'razorpay',
    orderId: body.razorpay_order_id,
    paymentId: body.razorpay_payment_id,
    plan: body.plan || null,
    thumbnailId: body.thumbnailId || null,
    message: 'Payment verified. HD download can be released.'
  }
})
