'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { EtapaVista, MapaProps, ProyectoMapa } from './tipos';

// Las funciones KMZ (dibujar capas, descargas, capas de referencia) van detrás del
// flag `mapaAvanzado`, que llega YA RESUELTO desde el servidor (prop kmzOn): apagadas
// por defecto, el mapa se comporta como antes (solo marcadores). El sostenedor las
// prende cuando las quiere (NEXT_PUBLIC_FEAT_MAPA_PLUS=true).

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const enlaceSeguro = (url?: string) => (url && /^https?:\/\/[^\s]+$/i.test(url) ? url : null);

export default function ProyectosMap({ proyectos, capasReferencia, etapas, mapasBase, textos, kmzOn }: MapaProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const capasRef = useRef<L.LayerGroup | null>(null);
  const geojsonCache = useRef<Map<string, unknown>>(new Map());
  const [filtroRegion, setFiltroRegion] = useState<string>('todos');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todos');

  const colorDe = useMemo(() => {
    const m = new Map(etapas.map((e) => [e.valor, e.color]));
    return (etapa: string) => m.get(etapa) || '#6B7280';
  }, [etapas]);
  const etiquetaDe = useMemo(() => {
    const m = new Map(etapas.map((e) => [e.valor, e.etiqueta]));
    return (etapa: string) => m.get(etapa) || etapa;
  }, [etapas]);

  const filtered = useMemo(
    () => proyectos.filter((p) => {
      if (filtroRegion !== 'todos' && p.region !== filtroRegion) return false;
      if (filtroEtapa !== 'todos' && p.etapa !== filtroEtapa) return false;
      return true;
    }),
    [proyectos, filtroRegion, filtroEtapa],
  );

  function iconoEtapa(color: string) {
    return L.divIcon({
      className: '',
      html: `<div style="width:22px;height:22px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -13],
    });
  }

  function popupHtml(p: ProyectoMapa): string {
    const filas: string[] = [
      `<h3 style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1B3A5C;">${escapeHtml(p.nombre)}</h3>`,
    ];
    if (p.empresa) filas.push(`<p style="margin:0 0 4px;font-size:12px;color:#0D7377;">${escapeHtml(p.empresa)}</p>`);
    if (p.descripcion) filas.push(`<p style="margin:0 0 6px;font-size:13px;color:#4B5563;">${escapeHtml(p.descripcion)}</p>`);
    filas.push(`<p style="margin:0 0 2px;font-size:11px;color:#6B7280;"><strong>${escapeHtml(textos.etiquetaEtapa)}:</strong> ${escapeHtml(etiquetaDe(p.etapa))}</p>`);
    if (p.capacidadMW) filas.push(`<p style="margin:0 0 2px;font-size:11px;color:#6B7280;">${p.capacidadMW} MW</p>`);
    const ext = enlaceSeguro(p.url);
    if (ext) filas.push(`<a href="${escapeHtml(ext)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#0D7377;">${escapeHtml(textos.textoVerProyecto)}</a><br/>`);
    if (kmzOn) filas.push(`<a href="/api/geo/proyectos/${encodeURIComponent(p.id)}/kmz" style="display:inline-block;margin-top:6px;font-size:12px;font-weight:600;color:#0D7377;">${escapeHtml(textos.botonDescargarProyecto)}</a>`);
    return `<div style="font-family:system-ui,sans-serif;max-width:260px;">${filas.join('')}</div>`;
  }

  // Dibuja el GeoJSON de una capa (desde caché o pidiéndolo) en un LayerGroup.
  async function dibujarCapa(id: string, destino: L.LayerGroup, color: string) {
    try {
      let geojson = geojsonCache.current.get(id);
      if (!geojson) {
        const r = await fetch(`/api/geo/capas/${encodeURIComponent(id)}/geojson`);
        if (!r.ok) return;
        geojson = await r.json();
        geojsonCache.current.set(id, geojson);
      }
      const capa = L.geoJSON(geojson as GeoJSON.GeoJsonObject, {
        style: { color, weight: 2, fillColor: color, fillOpacity: 0.25 },
        pointToLayer: (_f, latlng) => L.circleMarker(latlng, { radius: 5, color, fillColor: color, fillOpacity: 0.6 }),
      });
      destino.addLayer(capa);
    } catch {
      // capa no disponible: se ignora, el marcador del proyecto queda igual
    }
  }

  // ── Inicializar el mapa una sola vez ──
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = L.map(mapContainer.current, { center: [-38.74, -72.59], zoom: 7, zoomControl: true });
    mapRef.current = map;

    // Mapas base editables. El satelital (legacy) cae al primero no-satelital en error.
    const bases: Record<string, L.TileLayer> = {};
    const noSatelital = mapasBase.find((m) => !m.esSatelital) || mapasBase[0];
    let base0: L.TileLayer | null = null;
    for (const mb of mapasBase) {
      const capa = L.tileLayer(mb.urlPlantilla, { attribution: mb.atribucion, maxZoom: mb.maxZoom || 18 });
      bases[mb.nombre] = capa;
      if (mb.esSatelital && noSatelital && noSatelital !== mb) {
        capa.on('tileerror', () => {
          if (map.hasLayer(capa)) { map.removeLayer(capa); bases[noSatelital.nombre]?.addTo(map); }
        });
      }
      if (!base0) { capa.addTo(map); base0 = capa; }
    }

    markersRef.current = L.layerGroup().addTo(map);
    capasRef.current = L.layerGroup().addTo(map);

    // Capas de referencia como overlays apagados; su geojson se pide al prenderlas.
    // Solo con el flag KMZ activo.
    const overlays: Record<string, L.LayerGroup> = {};
    if (kmzOn) {
      for (const ref of capasReferencia) {
        const grupo = L.layerGroup();
        overlays[ref.titulo || `Capa ${ref.id}`] = grupo;
        grupo.on('add', () => {
          if (grupo.getLayers().length === 0) dibujarCapa(ref.id, grupo, ref.color || '#1B3A5C');
        });
      }
    }

    const control = L.control.layers(bases, overlays, { position: 'topright' }).addTo(map);
    // a11y: etiquetar el botón del control en español.
    const botón = control.getContainer()?.querySelector('a.leaflet-control-layers-toggle');
    if (botón) botón.setAttribute('aria-label', textos.ariaControlCapas);

    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Dibujar marcadores + capas de proyecto, y encuadrar, cuando cambia el filtro ──
  useEffect(() => {
    const map = mapRef.current, markers = markersRef.current, capas = capasRef.current;
    if (!map || !markers || !capas) return;
    markers.clearLayers();
    capas.clearLayers();

    filtered.forEach((p) => {
      const color = colorDe(p.etapa);
      // Con el flag apagado nunca se dibuja la capa, así que el marcador va siempre.
      if (!kmzOn || p.mostrarMarcador !== false || !p.capa) {
        L.marker([p.coordenadas.lat, p.coordenadas.lng], { icon: iconoEtapa(color) })
          .bindPopup(popupHtml(p))
          .addTo(markers);
      }
      if (kmzOn && p.capa) dibujarCapa(p.capa.id, capas, p.capa.color || color);
    });

    centrar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  function centrar() {
    const map = mapRef.current;
    if (!map || filtered.length === 0) return;
    const bounds = L.latLngBounds(filtered.map((p) => [p.coordenadas.lat, p.coordenadas.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }

  const hayProyectos = proyectos.length > 0;
  const regiones: Array<[string, string]> = [['todos', 'Todos'], ['araucania', 'Araucanía'], ['nacional', 'Nacional']];

  return (
    <>
      {/* Descargas KMZ / Google Earth (solo con el flag mapaAvanzado activo) */}
      {hayProyectos && kmzOn && (
        <section className="py-6 px-4 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
            <div className="mr-auto">
              <h2 className="text-sm font-semibold text-h2v-blue">{textos.tituloDescargas}</h2>
              <p className="text-xs text-gray-500">{textos.ayudaKmz}</p>
            </div>
            {/* Descargas de archivo (no páginas): <a> es lo correcto, no <Link>. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/geo/proyectos/kmz" className="px-3 py-1.5 text-sm rounded-full bg-h2v-green text-white hover:opacity-90">
              {textos.botonDescargarTodo}
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/geo/proyectos/kml" className="px-3 py-1.5 text-sm rounded-full border border-h2v-green text-h2v-green hover:bg-h2v-green/5">
              {textos.botonAbrirGoogleEarth}
            </a>
          </div>
        </section>
      )}

      {/* Mapa */}
      <div className="relative">
        {hayProyectos ? (
          <div ref={mapContainer} className="h-[60vh] min-h-[400px] w-full" role="application" aria-label="Mapa de proyectos" />
        ) : (
          <div className="h-[60vh] min-h-[400px] bg-gradient-to-br from-h2v-green/10 to-h2v-blue/10 flex items-center justify-center">
            <div className="text-center p-8 bg-white/80 backdrop-blur rounded-xl shadow-sm max-w-md">
              <h2 className="text-xl font-semibold text-h2v-blue mb-2">Mapa interactivo</h2>
              <p className="text-sm text-gray-500">El mapa se activará cuando se registren proyectos en el sistema.</p>
            </div>
          </div>
        )}
        {hayProyectos && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow-md p-3 text-xs z-[1000]">
            {etapas.map((e: EtapaVista) => (
              <div key={e.valor} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                <span className="text-gray-700">{e.etiqueta}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtros */}
      {hayProyectos && (
        <section className="py-6 px-4 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-gray-500">{textos.etiquetaUbicacion}:</span>
            {regiones.map(([v, l]) => (
              <button key={v} onClick={() => setFiltroRegion(v)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroRegion === v ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}>
                {l}
              </button>
            ))}
            <span className="text-sm font-medium text-gray-500 ml-4">{textos.etiquetaEtapa}:</span>
            <button onClick={() => setFiltroEtapa('todos')}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroEtapa === 'todos' ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}>
              Todas
            </button>
            {etapas.map((e) => (
              <button key={e.valor} onClick={() => setFiltroEtapa(e.valor)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroEtapa === e.valor ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}>
                {e.etiqueta}
              </button>
            ))}
            <button onClick={centrar} className="ml-auto px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-600 hover:border-h2v-green">
              {textos.botonCentrar}
            </button>
            <span className="text-sm text-gray-400">{filtered.length} proyecto{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </section>
      )}

      {/* Lista de tarjetas (equivalente accesible por teclado a los marcadores) */}
      {filtered.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colorDe(p.etapa) }} />
                  <span className="text-xs text-gray-400">{etiquetaDe(p.etapa)} — {p.region === 'araucania' ? 'Araucanía' : 'Nacional'}</span>
                </div>
                <h3 className="font-semibold text-h2v-blue mb-1">{p.nombre}</h3>
                {p.empresa && <p className="text-sm text-h2v-green mb-2">{p.empresa}</p>}
                <p className="text-sm text-gray-500 line-clamp-2">{p.descripcion}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {enlaceSeguro(p.url) && (
                    <a href={enlaceSeguro(p.url)!} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-h2v-green hover:underline">
                      {textos.textoVerProyecto}
                    </a>
                  )}
                  {kmzOn && (
                    <a href={`/api/geo/proyectos/${encodeURIComponent(p.id)}/kmz`} className="text-sm font-medium text-h2v-green hover:underline">
                      {textos.botonDescargarProyecto}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
