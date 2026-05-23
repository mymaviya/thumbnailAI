<template>
  <div>
    <PageHero
      eyebrow="Refunds"
      title="Cancellation and Refund Policy"
      description="How cancellations, duplicate payments, failed downloads, and refund requests are handled for AI Thumbnail Maker."
    />

    <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="space-y-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-coral">Last updated: May 23, 2026</p>
          <p class="mt-3 leading-7 text-slate-600">
            AI Thumbnail Maker sells digital thumbnail downloads and digital access. This policy explains when an order can be cancelled and how refund requests are reviewed.
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
  'Cancellation and Refund Policy - AI Thumbnail Maker',
  'Read the cancellation and refund policy for AI Thumbnail Maker digital thumbnail downloads, failed payments, duplicate payments, and technical issues.',
  '/cancellation-and-refund-policy'
)

const sections = [
  {
    title: 'Digital Product Policy',
    body: 'AI Thumbnail Maker provides digital templates, AI-generated thumbnail previews, editor access, and watermark-free HD downloads. Once a paid download or digital access has been delivered, orders are generally not eligible for cancellation.'
  },
  {
    title: 'Cancellation Before Delivery',
    body: 'If a payment is pending and digital access has not been unlocked, you may contact support to request cancellation. If the order has not been fulfilled, we may cancel it or allow the payment to fail automatically depending on the payment status.'
  },
  {
    title: 'Eligible Refund Cases',
    body: 'Refunds may be approved for duplicate payments, payment deductions where access was not unlocked, verified technical issues that prevent delivery, or other cases required by applicable law.'
  },
  {
    title: 'Non-Refundable Cases',
    body: 'Refunds are generally not provided after successful delivery of watermark-free downloads, for change of mind, for incorrect prompt choices, for dissatisfaction with editable/generated creative output after access is delivered, or for misuse of the service.'
  },
  {
    title: 'Refund Request Window',
    body: 'Refund requests should be submitted within 7 days of payment. Include your Razorpay payment ID, order ID, selected plan, thumbnail ID if available, and a short explanation of the issue.'
  },
  {
    title: 'Refund Processing Time',
    body: 'Approved refunds are initiated to the original payment method. Depending on Razorpay, your bank, card issuer, UPI provider, or wallet provider, the amount may take 5 to 10 business days to reflect.'
  },
  {
    title: 'Failed or Pending Payments',
    body: 'If a payment fails or remains pending, no paid access is delivered until payment verification succeeds. Any deduction for a failed payment is usually reversed by the payment provider or bank according to their timelines.'
  },
  {
    title: 'Contact for Refunds',
    body: 'For cancellation or refund support, contact us through the Contact Us page with your payment and order details.'
  }
]
</script>
