'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Proyecto = {
  id: string;
  nombre: string;
  descripcion: string;
  empresa: string;
  etapa: string;
  region: string;
  coordenadas: { lat: number; lng: number };
  capacidadMW?: number;
  produccionTonAnio?: number;
};

const etapaColor: Record<string, string> = {
  planificacion: '#F59E0B',
  pilotaje: '#3B82F6',
  desarrollo: '#8B5CF6',
  operacion: '#10B981',
};

const etapaLabel: Record<string, string> = {
  planificacion: 'Planificacion',
  pilotaje: 'Pilotaje',
  desarrollo: 'Desarrollo',
  operacion: 'Operacion',
};

function createIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

export default function ProyectosMap({ proyectos }: { proyectos: Proyecto[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [filtroRegion, setFiltroRegion] = useState<string>('todos');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todos');

  const filtered = proyectos.filter((p) => {
    if (filtroRegion !== 'todos' && p.region !== filtroRegion) return false;
    if (filtroEtapa !== 'todos' && p.etapa !== filtroEtapa) return false;
    return true;
  });

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current, {
      center: [-38.74, -72.59], // Temuco
      zoom: 7,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    filtered.forEach((p) => {
      const color = etapaColor[p.etapa] || '#6B7280';
      const icon = createIcon(color);

      const popupContent = `
        <div style="font-family:system-ui,sans-serif;max-width:260px;">
          <h3 style="margin:0 0 4px;font-size:15px;font-weight:700;color:var(--h2v-blue,#1B3A5C);">${escapeHtml(p.nombre)}</h3>
          <p style="margin:0 0 6px;font-size:12px;color:var(--h2v-green,#0D7377);">${escapeHtml(p.empresa)}</p>
          <p style="margin:0 0 8px;font-size:13px;color:#4B5563;">${escapeHtml(p.descripcion)}</p>
          <div style="display:flex;gap:12px;font-size:11px;color:#6B7280;">
            <span><strong>Etapa:</strong> ${etapaLabel[p.etapa] || p.etapa}</span>
            ${p.capacidadMW ? `<span><strong>Capacidad:</strong> ${p.capacidadMW} MW</span>` : ''}
            ${p.produccionTonAnio ? `<span><strong>Produccion:</strong> ${p.produccionTonAnio.toLocaleString()} ton/ano</span>` : ''}
          </div>
        </div>
      `;

      L.marker([p.coordenadas.lat, p.coordenadas.lng], { icon })
        .bindPopup(popupContent)
        .addTo(markersRef.current!);
    });

    // Fit bounds if markers exist
    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((p) => [p.coordenadas.lat, p.coordenadas.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [filtered]);

  return (
    <>
      {/* Map */}
      <div className="relative">
        {proyectos.length > 0 ? (
          <div ref={mapContainer} className="h-[60vh] min-h-[400px] w-full" />
        ) : (
          <div className="h-[60vh] min-h-[400px] bg-gradient-to-br from-h2v-green/10 to-h2v-blue/10 flex items-center justify-center">
            <div className="text-center p-8 bg-white/80 backdrop-blur rounded-xl shadow-sm max-w-md">
              <svg className="w-16 h-16 mx-auto mb-4 text-h2v-green/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h2 className="text-xl font-semibold text-h2v-blue mb-2">Mapa interactivo</h2>
              <p className="text-sm text-gray-500">
                El mapa se activara cuando se registren proyectos en el sistema.
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        {proyectos.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow-md p-3 text-xs z-[1000]">
            {Object.entries(etapaLabel).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: etapaColor[key] }} />
                <span className="text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <section className="py-6 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-500">Ubicacion:</span>
          {[['todos', 'Todos'], ['araucania', 'Araucania'], ['nacional', 'Nacional']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFiltroRegion(v)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroRegion === v ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}
            >
              {l}
            </button>
          ))}
          <span className="text-sm font-medium text-gray-500 ml-4">Etapa:</span>
          {[['todos', 'Todas'], ...Object.entries(etapaLabel)].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFiltroEtapa(v)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroEtapa === v ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}
            >
              {l}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400">{filtered.length} proyecto{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </section>

      {/* Project list below map */}
      {filtered.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: etapaColor[p.etapa] || '#6B7280' }} />
                  <span className="text-xs text-gray-400">{etapaLabel[p.etapa] || p.etapa} — {p.region === 'araucania' ? 'Araucania' : 'Nacional'}</span>
                </div>
                <h3 className="font-semibold text-h2v-blue mb-1">{p.nombre}</h3>
                <p className="text-sm text-h2v-green mb-2">{p.empresa}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{p.descripcion}</p>
                {(p.capacidadMW || p.produccionTonAnio) && (
                  <div className="flex gap-4 mt-3 text-xs text-gray-400">
                    {p.capacidadMW && <span>{p.capacidadMW} MW</span>}
                    {p.produccionTonAnio && <span>{p.produccionTonAnio.toLocaleString()} ton/ano</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
