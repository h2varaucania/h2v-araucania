import * as migration_20260704_211529_baseline_editabilidad from './20260704_211529_baseline_editabilidad';
import * as migration_20260704_213000_datos_editabilidad from './20260704_213000_datos_editabilidad';
import * as migration_20260707_150000_qa_daniel_terminos_unidad from './20260707_150000_qa_daniel_terminos_unidad';
import * as migration_20260822_135326_mapa_kmz from './20260822_135326_mapa_kmz';

export const migrations = [
  {
    up: migration_20260704_211529_baseline_editabilidad.up,
    down: migration_20260704_211529_baseline_editabilidad.down,
    name: '20260704_211529_baseline_editabilidad',
  },
  {
    up: migration_20260704_213000_datos_editabilidad.up,
    down: migration_20260704_213000_datos_editabilidad.down,
    name: '20260704_213000_datos_editabilidad',
  },
  {
    up: migration_20260707_150000_qa_daniel_terminos_unidad.up,
    down: migration_20260707_150000_qa_daniel_terminos_unidad.down,
    name: '20260707_150000_qa_daniel_terminos_unidad',
  },
  {
    up: migration_20260822_135326_mapa_kmz.up,
    down: migration_20260822_135326_mapa_kmz.down,
    name: '20260822_135326_mapa_kmz'
  },
];
