export const usePageSeo = (title: string, description: string, path = '/') => {
  const config = useRuntimeConfig()
  const url = `${config.public.siteUrl}${path}`

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogType: 'website',
    ogUrl: url,
    ogImage: `${config.public.siteUrl}/og-image.svg`,
    twitterCard: 'summary_large_image'
  })

  useHead({
    link: [{ rel: 'canonical', href: url }]
  })
}
