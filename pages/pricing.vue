<template>
  <div>
    <PageHero
      eyebrow="Payment-ready downloads"
      title="Simple pricing for creators and teams"
      description="Free previews include a watermark. Paid downloads are wired through placeholder order logic for future Razorpay or Stripe integration."
    />
    <section class="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
      <article v-for="plan in plans" :key="plan.name" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-black">{{ plan.name }}</h2>
        <p class="mt-2 text-slate-600">{{ plan.description }}</p>
        <p class="mt-6 text-4xl font-black">{{ plan.price }}</p>
        <ul class="mt-6 space-y-3 text-sm font-semibold text-slate-600">
          <li v-for="feature in plan.features" :key="feature">✓ {{ feature }}</li>
        </ul>
        <button class="mt-6 w-full rounded-md bg-ink px-4 py-3 font-black text-white hover:bg-slate-700" @click="createOrder(plan.name)">
          Choose {{ plan.name }}
        </button>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo(
  'Pricing - AI Thumbnail Maker',
  'Compare AI Thumbnail Maker preview, creator, and team plans with payment-ready download logic.',
  '/pricing'
)

const plans = [
  {
    name: 'Preview',
    price: 'Free',
    description: 'Create and test watermarked thumbnails.',
    features: ['Watermarked previews', 'Template browsing', 'Basic editor access']
  },
  {
    name: 'Creator',
    price: '$9/mo',
    description: 'Download watermark-free thumbnails.',
    features: ['No watermark downloads', 'AI generations', 'PNG and JPG export']
  },
  {
    name: 'Studio',
    price: '$29/mo',
    description: 'For channels and production teams.',
    features: ['Team dashboard', 'Bulk downloads', 'Priority generation queue']
  }
]

const createOrder = async (plan: string) => {
  const result = await $fetch<{ orderId: string; provider: string }>('/api/payment/create-order', {
    method: 'POST',
    body: { plan, amount: plan === 'Studio' ? 29 : plan === 'Creator' ? 9 : 0, currency: 'USD' }
  })
  window.alert(`Placeholder ${result.provider} order created: ${result.orderId}`)
}
</script>
