import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://h2varaucania.cl'

// Nota: durante la fase pre-lanzamiento el sitio va con NOINDEX (meta + header X-Robots-Tag,
// ver layout.tsx y next.config.ts). Se DEJA el crawl permitido a propósito: para que Google
// respete el "noindex" primero tiene que poder leer la página. NO cambiar a `disallow: '/'`,
// eso impediría que vea la señal de noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
