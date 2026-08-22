'use client';

import dynamic from 'next/dynamic';
import type { MapaProps } from './tipos';

const ProyectosMap = dynamic(() => import('./ProyectosMap'), { ssr: false });

export default function ProyectosMapLoader(props: MapaProps) {
  return <ProyectosMap {...props} />;
}
