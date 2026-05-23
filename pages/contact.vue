<template>
  <div>
    <PageHero
      eyebrow="Support"
      title="Contact Us"
      description="Reach the Maviya IT Services team for payment, download, account, generation, or policy questions."
    />

    <section class="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-black text-ink">Business Contact</h2>
        <dl class="mt-6 space-y-5 text-sm">
          <div v-for="item in contactDetails" :key="item.label">
            <dt class="font-black text-slate-900">{{ item.label }}</dt>
            <dd class="mt-1 leading-7 text-slate-600">{{ item.value }}</dd>
          </div>
        </dl>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-black text-ink">Support Requests</h2>
        <p class="mt-3 leading-7 text-slate-600">
          For payment or download issues, include your Razorpay payment ID, order ID, selected plan, thumbnail ID if available, and the email or phone number used during payment.
        </p>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <article v-for="item in supportTopics" :key="item.title" class="rounded-lg border border-slate-200 p-4">
            <h3 class="font-black text-ink">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo(
  'Contact Us - Maviya IT Services',
  'Contact Maviya IT Services support for payment, download, account, thumbnail generation, and policy questions.',
  '/contact'
)

const contactDetails = [
  { label: 'Business Name', value: 'Maviya IT Services' },
  { label: 'Support Email', value: 'contact@thumbcraftai.com' },
  { label: 'Support Phone', value: '+91 96482 09795' },
  { label: 'Business Address', value: 'Chilmapur, Bharwaliya Road, Uttar Pradesh, Gorakhpur, 273016, India' },
  { label: 'Support Hours', value: 'Monday to Saturday, 10:00 AM to 6:00 PM IST' },
  { label: 'Response Time', value: 'We aim to respond within 2 business days.' }
]

const supportTopics = [
  {
    title: 'Payment Help',
    body: 'Contact us if your payment was deducted but the HD download did not unlock.'
  },
  {
    title: 'Download Help',
    body: 'Share the thumbnail or plan details if your generated file is unavailable or corrupted.'
  },
  {
    title: 'Refund Requests',
    body: 'Refund requests are reviewed according to our Cancellation and Refund Policy.'
  },
  {
    title: 'Privacy Requests',
    body: 'You can contact us for privacy questions, access requests, corrections, or deletion requests.'
  }
]
</script>
