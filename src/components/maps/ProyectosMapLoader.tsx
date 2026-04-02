'use client';

import dynamic from 'next/dynamic';

const ProyectosMap = dynamic(() => import('./ProyectosMap'), { ssr: false });

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

export default function ProyectosMapLoader({ proyectos }: { proyectos: Proyecto[] }) {
  return <ProyectosMap proyectos={proyectos} />;
}
