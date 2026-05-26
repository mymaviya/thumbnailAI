export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/seo'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    authSessionSecret: process.env.AUTH_SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    public: {
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://aithumbnailmaker.example.com',
      siteName: 'AI Thumbnail Maker'
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: title => {
        if (!title) return 'AI Thumbnail Maker by Maviya IT Services'
        return title.includes('AI Thumbnail Maker') ? title : `${title} | AI Thumbnail Maker`
      },
      meta: [
        { name: 'theme-color', content: '#ff4d5a' },
        { name: 'application-name', content: 'AI Thumbnail Maker' },
        { name: 'apple-mobile-web-app-title', content: 'AI Thumbnail Maker' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/favicon.svg' }
      ]
    }
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://aithumbnailmaker.example.com',
    name: 'AI Thumbnail Maker',
    description: 'Browse, customize, generate, preview, and download YouTube-ready video thumbnails.'
  },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Maviya IT Services',
      url: process.env.NUXT_PUBLIC_SITE_URL || 'https://aithumbnailmaker.example.com',
      logo: '/og-image.svg'
    }
  },
  robots: {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api', '/login']
      }
    ],
    sitemap: `${process.env.NUXT_PUBLIC_SITE_URL || 'https://aithumbnailmaker.example.com'}/sitemap.xml`
  }
})
