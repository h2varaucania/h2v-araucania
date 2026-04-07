import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload/getPayload'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://h2varaucania.cl'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/hidrogeno-verde`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/programa/quienes-somos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/programa/gobernanza`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/noticias`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/recursos/documentos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/recursos/eventos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/politica-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/accesibilidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic noticias pages
  let noticiasPages: MetadataRoute.Sitemap = []
  try {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: 'noticias',
      where: { publicado: { equals: true } },
      sort: '-fecha',
      limit: 1000,
    })

    noticiasPages = docs.map((noticia) => ({
      url: `${siteUrl}/noticias/${noticia.slug}`,
      lastModified: new Date(noticia.updatedAt as string),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // CMS unavailable — return static pages only
  }

  return [...staticPages, ...noticiasPages]
}
