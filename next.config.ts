import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["sharp", "graphql"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.h2varaucania.cl",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async headers() {
    // Pre-lanzamiento: header noindex en TODAS las respuestas (señal más fuerte para Google,
    // cubre también PDFs/API). Se apaga seteando SITE_INDEXABLE=true en Vercel y redeployando.
    const indexable = process.env.SITE_INDEXABLE === "true";
    return [
      {
        source: "/(.*)",
        headers: [
          ...(indexable
            ? []
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: http://localhost:*",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://api.mapbox.com https://events.mapbox.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
