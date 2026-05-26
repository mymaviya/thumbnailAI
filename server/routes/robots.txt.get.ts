export default defineEventHandler(event => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://aithumbnailmaker.example.com').replace(/\/$/, '')

  setHeader(event, 'content-type', 'text/plain; charset=UTF-8')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin',
    'Disallow: /dashboard',
    'Disallow: /login',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`
  ].join('\n')
})
