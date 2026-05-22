<template>
  <div>
    <PageHero
      eyebrow="Terms of use"
      title="Terms and Conditions"
      description="The rules for using AI Thumbnail Maker, including templates, AI generation, payments, downloads, and acceptable use."
    />

    <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="space-y-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-coral">Last updated: May 22, 2026</p>
          <p class="mt-3 leading-7 text-slate-600">
            By accessing or using AI Thumbnail Maker, you agree to these Terms and Conditions. If you do not agree, you should not use the service.
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
  'Terms and Conditions - AI Thumbnail Maker',
  'Review the Terms and Conditions for using AI Thumbnail Maker templates, AI generation, editor tools, payments, and downloads.',
  '/terms-and-conditions'
)

const sections = [
  {
    title: 'Use of the Service',
    body: 'AI Thumbnail Maker provides template browsing, AI thumbnail generation, editing, previews, and paid download features. You agree to use the service only for lawful purposes and in a way that does not harm the service, other users, or third parties.'
  },
  {
    title: 'Accounts and Access',
    body: 'You are responsible for keeping your account and device secure. If you believe someone has accessed your account or downloads without permission, contact support as soon as possible.'
  },
  {
    title: 'Generated and Edited Content',
    body: 'You are responsible for prompts, text, images, and other content you submit or create. Do not use the service to create unlawful, misleading, infringing, harmful, or abusive content.'
  },
  {
    title: 'Templates and License',
    body: 'Templates, layouts, interface elements, and platform assets remain owned by AI Thumbnail Maker or its licensors. After payment, you may use your exported thumbnail for your own video, channel, marketing, or business use, subject to these terms.'
  },
  {
    title: 'Payments and Downloads',
    body: 'Paid plans unlock watermark-free HD downloads according to the selected plan. Prices, features, and availability may change. Payment verification must be completed before paid download access is granted.'
  },
  {
    title: 'Refunds',
    body: 'Because downloads and digital access may be delivered immediately after payment, purchases are generally non-refundable unless required by law or approved by support for a verified billing or technical issue.'
  },
  {
    title: 'Prohibited Activities',
    body: 'You must not reverse engineer the service, bypass payment or watermark controls, overload the platform, scrape content at scale, upload malware, violate intellectual property rights, or use the service for illegal activity.'
  },
  {
    title: 'Service Availability',
    body: 'We try to keep the service reliable, but features may be updated, paused, limited, or discontinued. We are not responsible for losses caused by downtime, third-party provider issues, or unsupported use of the service.'
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent allowed by law, AI Thumbnail Maker is not liable for indirect, incidental, special, consequential, or lost-profit damages arising from your use of the service.'
  },
  {
    title: 'Changes to These Terms',
    body: 'We may update these terms from time to time. Continued use of AI Thumbnail Maker after changes are posted means you accept the updated terms.'
  },
  {
    title: 'Contact',
    body: 'For questions about these Terms and Conditions, contact the AI Thumbnail Maker support team through the contact method provided in the app or on the website.'
  }
]
</script>
