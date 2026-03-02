import type { MetadataRoute } from 'next'

const baseUrl = 'https://biaggioflooring.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/pt`, changefreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en`, changefreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/estimate`, changefreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/estimate/[id]`, changefreq: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/services`, changefreq: 'monthly', priority: 0.6 },
  ]
}
