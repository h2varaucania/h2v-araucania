import type { CollectionConfig } from 'payload';
import { APIError } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import { anyone, isAdmin, isAdminOrEditor } from '@/lib/access';
import { revalidaColeccion, revalidaColeccionAlBorrar } from '@/hooks/revalidate';
import { ingerirKmz } from '@/lib/geo/leer-kmz';
import { ErrorIngesta, MENSAJES } from '@/lib/geo/mensajes';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB (tope de body de Vercel serverless)

/**
 * Capas geográficas (KMZ/KML) que se dibujan en el Mapa de Proyectos y se pueden
 * descargar en Google Earth (docs/PLAN_MAPA_KMZ.md §4.1). El archivo se valida,
 * sanea y simplifica EN EL SERVIDOR al subir (hook beforeChange); el navegador
 * nunca descomprime ni parsea. Los campos derivados los llena el hook.
 */
export const CapasGeo: CollectionConfig = {
  slug: 'capas-geo',
  labels: { singular: 'Capa geográfica', plural: 'Capas geográficas (KMZ)' },
  // access EXPLÍCITO (nunca heredar el default Boolean(user), que dejaría subir
  // capas a cualquier usuario registrado). Idéntico a Media/Proyectos.
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'tipo', 'nFeatures', 'tiposGeometria'],
    group: 'Contenido',
    description:
      'Sube un archivo KMZ o KML (exportado desde Google Earth) con la geometría de un proyecto (polígono del predio, trazado) o una capa de referencia. Se valida y simplifica automáticamente al subir. Para asociarla a un proyecto, ve a Contenido → Proyectos y elígela en el campo "Capa geográfica".',
  },
  upload: {
    // Disco en dev; en producción el plugin Vercel Blob toma la colección.
    staticDir: path.resolve(dirname, '../../..', 'public/uploads/capas-geo'),
    // NO declarar mimeTypes: Payload valida el MIME por contenido ANTES del hook y
    // con mensajes en inglés; un .kml con BOM caería en text/plain. Sin lista, solo
    // se bloquean ejecutables/scripts y TODA la validación real ocurre en el hook.
  },
  // Los campos derivados NO se persisten por defecto en poblaciones por relación
  // (excluye el pesado `geojson`): protege el peso de /proyectos.
  defaultPopulate: {
    titulo: true,
    tipo: true,
    color: true,
    bbox: true,
    centroide: true,
    nFeatures: true,
    nVertices: true,
    tiposGeometria: true,
    // geojson NO
  },
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // Tope total de capas: la página es de difusión, no un repositorio SIG.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'capas-geo' });
          if (totalDocs >= 50) throw new APIError(MENSAJES.limiteCapas, 400, undefined, true);
        }

        const file = req.file;
        // Edición de metadatos sin archivo nuevo: conservar los derivados intactos.
        if (!file) return data;

        const tam = (file as { size?: number }).size ?? file.data.length;
        if (tam > MAX_BYTES) throw new APIError(MENSAJES.demasiadoGrande, 400, undefined, true);

        try {
          const maxVertices = data?.tipo === 'referencia' ? 8000 : 2000;
          const r = ingerirKmz(new Uint8Array(file.data), { maxVertices });
          data.geojson = r.geojson;
          data.bbox = { minLng: r.bbox[0], minLat: r.bbox[1], maxLng: r.bbox[2], maxLat: r.bbox[3] };
          data.centroide = { lat: r.centroide.lat, lng: r.centroide.lng };
          data.nFeatures = r.nFeatures;
          data.nVertices = r.nVertices;
          data.tiposGeometria = r.tiposGeometria.join(', ');
          data.resumenValidacion = r.resumen.length ? r.resumen.join('\n') : 'Sin observaciones.';
          return data;
        } catch (e) {
          // ErrorIngesta ya trae el mensaje en español; cualquier otra excepción
          // (fflate/xmldom/togeojson) se convierte en uno genérico en español.
          const msg = e instanceof ErrorIngesta ? e.message : MENSAJES.desconocido;
          throw new APIError(msg, 400, undefined, true);
        }
      },
    ],
    afterChange: [revalidaColeccion(['/proyectos'])],
    afterDelete: [revalidaColeccionAlBorrar(['/proyectos'])],
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      maxLength: 120,
      label: 'Título de la capa',
      admin: { description: 'Nombre descriptivo. Ej: "Predio planta Temuco", "Proyectos SEIA Araucanía".' },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      maxLength: 400,
      label: 'Descripción (opcional)',
      admin: { description: 'Breve descripción de qué muestra la capa.' },
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      defaultValue: 'proyecto',
      label: 'Tipo de capa',
      options: [
        { label: 'Geometría de un proyecto', value: 'proyecto' },
        { label: 'Capa de referencia (contexto)', value: 'referencia' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Las de "referencia" aparecen apagadas en el mapa y el visitante las prende si quiere.',
      },
    },
    {
      name: 'color',
      type: 'text',
      maxLength: 7,
      label: 'Color (opcional)',
      admin: {
        position: 'sidebar',
        description: 'Color hex (ej: #0D7377) para dibujar la capa. Si se deja vacío, usa el color de la etapa del proyecto.',
      },
    },
    // ── Campos derivados: los llena el hook al procesar el archivo (solo lectura) ──
    {
      name: 'resumenValidacion',
      type: 'textarea',
      label: 'Resultado del procesamiento',
      admin: {
        readOnly: true,
        description: 'Qué se detectó al subir el archivo (geometrías, simplificación, avisos). Lo completa el sistema.',
      },
    },
    {
      name: 'nFeatures',
      type: 'number',
      label: 'N.º de geometrías',
      admin: { position: 'sidebar', readOnly: true, disableListColumn: false },
    },
    {
      name: 'nVertices',
      type: 'number',
      label: 'N.º de vértices',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'tiposGeometria',
      type: 'text',
      maxLength: 120,
      label: 'Tipos de geometría',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'geojson',
      type: 'json',
      label: 'GeoJSON (interno)',
      admin: {
        hidden: true, // no renderizar: una capa grande colgaría el editor Monaco del admin
      },
    },
    {
      name: 'bbox',
      type: 'group',
      label: 'Caja envolvente',
      admin: { hidden: true },
      fields: [
        { name: 'minLng', type: 'number' },
        { name: 'minLat', type: 'number' },
        { name: 'maxLng', type: 'number' },
        { name: 'maxLat', type: 'number' },
      ],
    },
    {
      name: 'centroide',
      type: 'group',
      label: 'Centroide',
      admin: {
        description: 'Centro de la capa. Útil para copiar como coordenadas del proyecto si aún no las tienes.',
        readOnly: true,
      },
      fields: [
        { name: 'lat', type: 'number', admin: { readOnly: true } },
        { name: 'lng', type: 'number', admin: { readOnly: true } },
      ],
    },
  ],
};
