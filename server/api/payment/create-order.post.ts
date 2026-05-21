interface CreateOrderBody {
  plan: string
  amount: number
  currency?: string
  provider?: 'stripe' | 'razorpay'
  thumbnailId?: string
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig(event)
  const body = await readBody<CreateOrderBody>(event)

  if (!body.plan) {
    throw createError({
      statusCode: 422,
      statusMessage: 'plan is required.'
    })
  }

  const provider = body.provider || 'razorpay'
  const amount = Math.max(0, Number(body.amount || 0))
  const currency = body.currency || 'INR'

  if (provider !== 'razorpay') {
    throw createError({
      statusCode: 422,
      statusMessage: 'Only Razorpay checkout is currently enabled.'
    })
  }

  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Razorpay keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.'
    })
  }

  const order = await $fetch<{
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
    body: {
      amount: Math.round(amount * 100),
      currency,
      receipt: `thumb_${crypto.randomUUID().slice(0, 24)}`,
      notes: {
        plan: body.plan,
        thumbnailId: body.thumbnailId || ''
      }
    }
  })

  return {
    orderId: order.id,
    keyId: config.razorpayKeyId,
    provider,
    plan: body.plan,
    thumbnailId: body.thumbnailId || null,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    checkoutUrl: `/pricing?order=${order.id}&provider=${provider}`,
    message: 'Razorpay order created. Verify the payment before releasing watermark-free HD downloads.'
  }
})
