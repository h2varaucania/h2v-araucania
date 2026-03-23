'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  planificacion: 'Planificación',
  pilotaje: 'Pilotaje',
  desarrollo: 'Desarrollo',
  operacion: 'Operación',
};

export default function ProyectosMap({ proyectos }: { proyectos: Proyecto[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [filtroRegion, setFiltroRegion] = useState<string>('todos');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todos');

  const filtered = proyectos.filter((p) => {
    if (filtroRegion !== 'todos' && p.region !== filtroRegion) return false;
    if (filtroEtapa !== 'todos' && p.etapa !== filtroEtapa) return false;
    return true;
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token === 'your-mapbox-token') {
      // No token — show placeholder
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-72.59, -38.74], // Temuco
      zoom: 7,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    document.querySelectorAll('.mapboxgl-marker').forEach((el) => el.remove());

    filtered.forEach((p) => {
      const color = etapaColor[p.etapa] || '#6B7280';

      const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '300px' }).setHTML(`
        <div style="font-family: system-ui, sans-serif;">
          <h3 style="margin:0 0 4px; font-size:15px; font-weight:700; color:#1B3A5C;">${p.nombre}</h3>
          <p style="margin:0 0 6px; font-size:12px; color:#0D7377;">${p.empresa}</p>
          <p style="margin:0 0 8px; font-size:13px; color:#4B5563;">${p.descripcion}</p>
          <div style="display:flex; gap:12px; font-size:11px; color:#6B7280;">
            <span><strong>Etapa:</strong> ${etapaLabel[p.etapa] || p.etapa}</span>
            ${p.capacidadMW ? `<span><strong>Capacidad:</strong> ${p.capacidadMW} MW</span>` : ''}
            ${p.produccionTonAnio ? `<span><strong>Producción:</strong> ${p.produccionTonAnio.toLocaleString()} ton/año</span>` : ''}
          </div>
        </div>
      `);

      new mapboxgl.Marker({ color })
        .setLngLat([p.coordenadas.lng, p.coordenadas.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [filtered]);

  const hasToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN && process.env.NEXT_PUBLIC_MAPBOX_TOKEN !== 'your-mapbox-token';

  return (
    <>
      {/* Map */}
      <div className="relative">
        {hasToken ? (
          <div ref={mapContainer} className="h-[60vh] min-h-[400px] w-full" />
        ) : (
          <div className="h-[60vh] min-h-[400px] bg-gradient-to-br from-[#0D7377]/10 to-[#1B3A5C]/10 flex items-center justify-center">
            <div className="text-center p-8 bg-white/80 backdrop-blur rounded-xl shadow-sm max-w-md">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#0D7377]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h2 className="text-xl font-semibold text-[#1B3A5C] mb-2">Mapa interactivo</h2>
              <p className="text-sm text-gray-500">
                {proyectos.length > 0
                  ? `${proyectos.length} proyectos registrados. Configure NEXT_PUBLIC_MAPBOX_TOKEN para activar el mapa.`
                  : 'El mapa se activará cuando se registren proyectos y se configure el token de Mapbox.'}
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        {hasToken && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow-md p-3 text-xs">
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
          <span className="text-sm font-medium text-gray-500">Ubicación:</span>
          {[['todos', 'Todos'], ['araucania', 'Araucanía'], ['nacional', 'Nacional']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFiltroRegion(v)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroRegion === v ? 'bg-[#0D7377] text-white border-[#0D7377]' : 'border-gray-200 bg-white text-gray-600 hover:border-[#0D7377]'}`}
            >
              {l}
            </button>
          ))}
          <span className="text-sm font-medium text-gray-500 ml-4">Etapa:</span>
          {[['todos', 'Todas'], ...Object.entries(etapaLabel)].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFiltroEtapa(v)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroEtapa === v ? 'bg-[#0D7377] text-white border-[#0D7377]' : 'border-gray-200 bg-white text-gray-600 hover:border-[#0D7377]'}`}
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
                  <span className="text-xs text-gray-400">{etapaLabel[p.etapa] || p.etapa} — {p.region === 'araucania' ? 'Araucanía' : 'Nacional'}</span>
                </div>
                <h3 className="font-semibold text-[#1B3A5C] mb-1">{p.nombre}</h3>
                <p className="text-sm text-[#0D7377] mb-2">{p.empresa}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{p.descripcion}</p>
                {(p.capacidadMW || p.produccionTonAnio) && (
                  <div className="flex gap-4 mt-3 text-xs text-gray-400">
                    {p.capacidadMW && <span>{p.capacidadMW} MW</span>}
                    {p.produccionTonAnio && <span>{p.produccionTonAnio.toLocaleString()} ton/año</span>}
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
