import * as migration_20260402_000000_initial from './20260402_000000_initial';

export const migrations = [
  {
    name: '20260402_000000_initial',
    up: migration_20260402_000000_initial.up,
    down: migration_20260402_000000_initial.down,
  },
];
