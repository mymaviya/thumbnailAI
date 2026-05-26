import { categories } from '~/data/templates'

interface SitemapEntry {
  loc: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: string
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, '-')

export default defineEventHandler(event => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://aithumbnailmaker.example.com').replace(/\/$/, '')
  const lastmod = new Date().toISOString().split('T')[0]

  const pages: SitemapEntry[] = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/templates', changefreq: 'weekly', priority: '0.9' },
    { loc: '/editor', changefreq: 'monthly', priority: '0.8' },
    { loc: '/pricing', changefreq: 'monthly', priority: '0.8' },
    { loc: '/contact', changefreq: 'yearly', priority: '0.6' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.4' },
    { loc: '/terms-and-conditions', changefreq: 'yearly', priority: '0.4' },
    { loc: '/cancellation-and-refund-policy', changefreq: 'yearly', priority: '0.4' },
    { loc: '/delivery-policy', changefreq: 'yearly', priority: '0.4' },
    { loc: '/shipping-policy', changefreq: 'yearly', priority: '0.4' },
    ...categories.map(category => ({
      loc: `/templates/${slugify(category)}`,
      changefreq: 'weekly' as const,
      priority: '0.8'
    }))
  ]

  setHeader(event, 'content-type', 'application/xml; charset=UTF-8')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(page => [
      '  <url>',
      `    <loc>${escapeXml(`${siteUrl}${page.loc}`)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${page.changefreq}</changefreq>`,
      `    <priority>${page.priority}</priority>`,
      '  </url>'
    ].join('\n')),
    '</urlset>'
  ].join('\n')
})
