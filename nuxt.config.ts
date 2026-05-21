export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/seo'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://aithumbnailmaker.example.com',
      siteName: 'AI Thumbnail Maker'
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
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
      name: 'AI Thumbnail Maker',
      url: process.env.NUXT_PUBLIC_SITE_URL || 'https://aithumbnailmaker.example.com',
      logo: '/og-image.svg'
    }
  },
  robots: {
    rules: [{ userAgent: '*', allow: '/' }]
  }
})
