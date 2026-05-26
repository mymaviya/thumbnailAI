<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page-slide', mode: 'out-in' }" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Maviya IT Services',
        url: siteUrl,
        logo: `${siteUrl}/og-image.svg`
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AI Thumbnail Maker',
        url: siteUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Maviya IT Services'
        }
      })
    }
  ]
})
</script>
