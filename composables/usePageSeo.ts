interface PageSeoOptions {
  noindex?: boolean
  image?: string
}

export const usePageSeo = (title: string, description: string, path = '/', options: PageSeoOptions = {}) => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const url = `${siteUrl}${canonicalPath}`
  const image = options.image || `${siteUrl}/og-image.svg`

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogType: 'website',
    ogUrl: url,
    ogImage: image,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow'
  })

  useHead({
    link: [{ rel: 'canonical', href: url }]
  })
}
