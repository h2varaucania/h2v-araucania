import * as migration_20260704_211529_baseline_editabilidad from './20260704_211529_baseline_editabilidad';
import * as migration_20260704_213000_datos_editabilidad from './20260704_213000_datos_editabilidad';

export const migrations = [
  {
    up: migration_20260704_211529_baseline_editabilidad.up,
    down: migration_20260704_211529_baseline_editabilidad.down,
    name: '20260704_211529_baseline_editabilidad'
  },
  {
    up: migration_20260704_213000_datos_editabilidad.up,
    down: migration_20260704_213000_datos_editabilidad.down,
    name: '20260704_213000_datos_editabilidad'
  },
];
