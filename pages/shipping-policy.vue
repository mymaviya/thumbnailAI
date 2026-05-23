<template>
  <div>
    <PageHero
      eyebrow="Shipping"
      title="Shipping Policy"
      description="AI Thumbnail Maker is a digital product, so this page explains our no-physical-shipping policy and digital delivery process."
    />

    <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="space-y-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-coral">Last updated: May 23, 2026</p>
          <p class="mt-3 leading-7 text-slate-600">
            AI Thumbnail Maker provides digital thumbnail services only. No physical products are shipped.
          </p>
        </div>

        <article v-for="section in sections" :key="section.title">
          <h2 class="text-xl font-black text-ink">{{ section.title }}</h2>
          <p class="mt-3 leading-7 text-slate-600">{{ section.body }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo(
  'Shipping Policy - AI Thumbnail Maker',
  'Read the shipping policy for AI Thumbnail Maker digital thumbnail downloads, including no physical shipping and instant digital delivery.',
  '/shipping-policy'
)

const sections = [
  {
    title: 'No Physical Shipping',
    body: 'AI Thumbnail Maker does not sell or ship physical goods. We do not provide courier delivery, postal delivery, printed thumbnails, or physical media.'
  },
  {
    title: 'Digital Delivery',
    body: 'Paid purchases unlock digital access to watermark-free HD thumbnail downloads inside the website after successful Razorpay payment verification.'
  },
  {
    title: 'Delivery Timeline',
    body: 'Digital delivery is usually immediate after payment verification. Temporary delays may occur because of payment confirmation delays, network issues, service maintenance, or browser-related issues.'
  },
  {
    title: 'Shipping Fees',
    body: 'No shipping or handling fees apply because all products are delivered digitally. Any listed price is for digital access, generation, editing, or download rights.'
  },
  {
    title: 'Delivery Support',
    body: 'If your payment succeeds but download access does not unlock, contact support with your Razorpay payment ID, order ID, selected plan, and thumbnail ID if available.'
  },
  {
    title: 'Contact',
    body: 'For questions about digital delivery or shipping policy, contact us through the Contact Us page.'
  }
]
</script>
