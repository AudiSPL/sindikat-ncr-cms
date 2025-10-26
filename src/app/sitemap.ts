import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://app.sindikatncr.com'
  
  const routes = [
    '',
    '/sr',
    '/en',
    '/sr/nova-pristupnica',
    '/en/nova-pristupnica',
    '/sr/tema/ko-smo-mi',
    '/en/tema/ko-smo-mi',
    '/sr/tema/nas-plan',
    '/en/tema/nas-plan',
    '/sr/tema/benefiti',
    '/en/tema/benefiti',
    '/sr/tema/anonimnost',
    '/en/tema/anonimnost',
    '/sr/tema/pravna-podrska',
    '/en/tema/pravna-podrska',
    '/sr/tema/faq',
    '/en/tema/faq',
    '/sr/kontakt',
    '/en/kontakt',
    '/sr/dokumenti',
    '/en/dokumenti',
    '/sr/politika-privatnosti',
    '/en/politika-privatnosti',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' || route === '/sr' ? 1 : 0.8,
  }))
}
