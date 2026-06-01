<template>
  <div>
    <PageHero
      eyebrow="Digital delivery"
      title="Delivery Policy"
      description="How Maviya IT Services delivers AI Thumbnail Maker digital access, previews, and watermark-free HD downloads after payment."
    />

    <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="space-y-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-coral">Last updated: June 1, 2026</p>
          <p class="mt-3 leading-7 text-slate-600">
            Maviya IT Services provides AI Thumbnail Maker digital products only. No physical goods are shipped.
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
  'Delivery Policy - Maviya IT Services',
  'Learn how Maviya IT Services delivers AI Thumbnail Maker digital thumbnail downloads and paid access after successful payment verification.',
  '/delivery-policy'
)

const sections = [
  {
    title: 'Digital Delivery Only',
    body: 'All AI Thumbnail Maker products from Maviya IT Services are digital. We do not ship physical products, printed thumbnails, storage devices, or paper invoices by courier or post.'
  },
  {
    title: 'Delivery Method',
    body: 'After successful payment verification, watermark-free HD thumbnail download access is unlocked inside the website. Depending on the selected plan, you can download the eligible thumbnail file in the available export format.'
  },
  {
    title: 'Delivery Timeline',
    body: 'Digital delivery is usually immediate after successful Razorpay payment verification. In rare cases, delivery may take longer because of UPI confirmation delays, payment provider delays, network issues, or service maintenance.'
  },
  {
    title: 'No Shipping Charges',
    body: 'Because the service is digital, no shipping charges apply. Any displayed price relates to digital access, generation, editing, or downloads, not physical delivery.'
  },
  {
    title: 'Access Issues',
    body: 'If payment succeeds but paid access or downloads do not unlock, contact support with your Razorpay payment ID, order ID, selected plan, payment method such as UPI/card/netbanking if known, and thumbnail ID if available.'
  },
  {
    title: 'File Availability',
    body: 'Generated previews, edited thumbnails, and downloads may depend on browser storage, account state, or service availability. We recommend downloading purchased files soon after access is unlocked.'
  },
  {
    title: 'Contact',
    body: 'For delivery or download support, contact us through the Contact Us page.'
  }
]
</script>
