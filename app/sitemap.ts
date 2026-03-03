import type { MetadataRoute } from 'next'

const baseUrl = 'https://biaggioflooring.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/pt`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/estimate`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/estimate/[id]`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
