import { createHmac, timingSafeEqual } from 'node:crypto'

const safeEqual = (left: string, right: string) => {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export const verifyRazorpayPaymentSignature = (orderId: string, paymentId: string, signature: string, secret: string) => {
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
  return safeEqual(expected, signature)
}

export const verifyRazorpayWebhookSignature = (body: string, signature: string, secret: string) => {
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  return safeEqual(expected, signature)
}

export const createRazorpayOrder = async (event: any, payload: {
  amount: number
  currency: string
  receipt: string
  notes: Record<string, string>
}) => {
  const config = useRuntimeConfig(event)

  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Razorpay keys are not configured.'
    })
  }

  return await $fetch<{
    id: string
    amount: number
    currency: string
    status: string
    receipt?: string
  }>('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: payload
  })
}
