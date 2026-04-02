# =============================================================================
# Dockerfile — H2V Araucania
# Build multi-stage para Next.js 16 + Payload CMS 3.80 + sharp (Alpine)
# Uso: docker compose up --build
# =============================================================================

# ---------------------------------------------------------------------------
# Etapa 1: Dependencias
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Librerías nativas requeridas por sharp y PostgreSQL
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

# Instalar TODAS las dependencias (dev incluidas, se necesitan para el build)
RUN npm ci

# Instalar sharp compilado para linux/musl (Alpine)
RUN npm install --os=linux --cpu=x64 --libc=musl sharp@0.34.5

# ---------------------------------------------------------------------------
# Etapa 2: Build de la aplicacion
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Desactivar telemetria de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar dependencias de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar tipos de Payload y construir la aplicacion
RUN npm run build

# ---------------------------------------------------------------------------
# Etapa 3: Runner de produccion (imagen minima)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Librerías nativas requeridas en runtime por sharp
RUN apk add --no-cache libc6-compat

# Crear usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar artefactos del build (standalone output de Next.js)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Directorio de uploads con permisos correctos
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Cambiar a usuario no-root
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
