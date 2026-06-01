<template>
  <div>
    <PageHero
      eyebrow="Privacy policy"
      title="Privacy Policy"
      description="How Maviya IT Services handles information when you browse templates, generate thumbnails, and unlock downloads through AI Thumbnail Maker."
    />

    <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="space-y-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-coral">Last updated: June 1, 2026</p>
          <p class="mt-3 leading-7 text-slate-600">
            This Privacy Policy explains how Maviya IT Services handles information related to your use of AI Thumbnail Maker, including thumbnail templates, AI generation tools, editor, dashboard, payments, and downloads.
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
  'Privacy Policy - Maviya IT Services',
  'Read how Maviya IT Services collects, uses, stores, and protects information for AI Thumbnail Maker generation, editing, payments, and downloads.',
  '/privacy'
)

const sections = [
  {
    title: 'Information We Collect',
    body: 'We may collect information you provide while using the service, such as generated prompts, selected templates, editor choices, download activity, account-related details, and payment metadata needed to process purchases. Payment card details, UPI IDs, UPI PINs, bank credentials, or wallet credentials are handled by Razorpay or the relevant payment provider and are not stored by us.'
  },
  {
    title: 'How We Use Information',
    body: 'We use information to provide thumbnail generation, editing, template previews, payment verification, watermark-free downloads, customer support, fraud prevention, analytics, and service improvements.'
  },
  {
    title: 'AI Generated Content',
    body: 'Prompts and generation settings may be processed to create thumbnail concepts and improve the reliability of the product. Avoid submitting confidential, sensitive, or personal information in prompts or editable thumbnail text.'
  },
  {
    title: 'Cookies and Analytics',
    body: 'We may use cookies, local storage, and analytics tools to keep the app working, remember preferences, measure usage, and understand which templates and features are useful to creators.'
  },
  {
    title: 'Payments',
    body: 'Payments are processed through Razorpay. Razorpay Checkout may offer UPI, cards, netbanking, wallets, or other enabled payment methods. We receive limited transaction information, such as order ID, payment ID, plan, amount, currency, method status, and verification status, so we can unlock paid downloads and support refund or failed-payment requests.'
  },
  {
    title: 'UPI Payment Privacy',
    body: 'For UPI payments, authorization happens inside Razorpay Checkout and supported UPI apps or bank systems. We do not collect your UPI PIN, MPIN, app password, or bank login details. Do not share these credentials with our support team or anyone claiming to represent us.'
  },
  {
    title: 'Data Sharing',
    body: 'Maviya IT Services does not sell your personal information. We may share limited information with service providers that help us operate the app, process payments, deliver downloads, maintain security, or comply with legal requirements.'
  },
  {
    title: 'Data Security',
    body: 'We use reasonable technical and organizational measures to protect information. No online service can guarantee absolute security, so you should use strong passwords and avoid uploading or entering information that you do not want processed by the service.'
  },
  {
    title: 'Your Choices',
    body: 'You can choose what information you enter, clear browser storage, stop using optional features, and contact us to request access, correction, or deletion of information where applicable law gives you those rights.'
  },
  {
    title: 'Contact',
    body: 'For privacy questions or requests, contact Maviya IT Services through the contact method provided in the app or on the website.'
  }
]
</script>
