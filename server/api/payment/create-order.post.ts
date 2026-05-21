interface CreateOrderBody {
  plan: string
  amount: number
  currency?: string
  provider?: 'stripe' | 'razorpay'
}

export default defineEventHandler(async event => {
  const body = await readBody<CreateOrderBody>(event)

  if (!body.plan) {
    throw createError({
      statusCode: 422,
      statusMessage: 'plan is required.'
    })
  }

  const provider = body.provider || 'stripe'
  const amount = Math.max(0, Number(body.amount || 0))

  return {
    orderId: `order_${crypto.randomUUID()}`,
    provider,
    plan: body.plan,
    amount,
    currency: body.currency || 'USD',
    status: amount === 0 ? 'free_preview' : 'created',
    checkoutUrl: `/pricing?order=placeholder&provider=${provider}`,
    message: 'Placeholder payment order. Replace this route with Razorpay or Stripe server SDK logic.'
  }
})
