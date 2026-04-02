import { describe, it, expect } from 'vitest';
import type { GlobalConfig, Field } from 'payload';

import { ContactoGlobal } from '@/globals/Contacto';
import { GuiaAdmin } from '@/globals/GuiaAdmin';
import { PaginaCapitalHumano } from '@/globals/PaginaCapitalHumano';
import { PaginaComunidad } from '@/globals/PaginaComunidad';
import { PaginaGobernanza } from '@/globals/PaginaGobernanza';
import { PaginaH2V } from '@/globals/PaginaH2V';
import { PaginaHojaRuta } from '@/globals/PaginaHojaRuta';
import { PaginaInicio } from '@/globals/PaginaInicio';
import { PaginaMarcoRegulatorio } from '@/globals/PaginaMarcoRegulatorio';
import { PaginaQuienesSomos } from '@/globals/PaginaQuienesSomos';
import { PaginaSectores } from '@/globals/PaginaSectores';
import { SitioGeneral } from '@/globals/SitioGeneral';

const globals: GlobalConfig[] = [
  ContactoGlobal,
  GuiaAdmin,
  PaginaCapitalHumano,
  PaginaComunidad,
  PaginaGobernanza,
  PaginaH2V,
  PaginaHojaRuta,
  PaginaInicio,
  PaginaMarcoRegulatorio,
  PaginaQuienesSomos,
  PaginaSectores,
  SitioGeneral,
];

describe('Global configs', () => {
  it.each(globals.map((g) => [g.slug, g]))(
    '%s has admin.description',
    (_slug, global) => {
      const g = global as GlobalConfig;
      expect(g.admin?.description).toBeTruthy();
      expect(typeof g.admin!.description).toBe('string');
    },
  );

  it.each(globals.map((g) => [g.slug, g]))(
    '%s has admin.group',
    (_slug, global) => {
      const g = global as GlobalConfig;
      expect(g.admin?.group).toBeTruthy();
    },
  );
});

describe('Global text fields have maxLength', () => {
  /**
   * Recursively collect all text fields from a fields array,
   * including those nested in groups and arrays.
   */
  function collectTextFields(fields: Field[], path = ''): { path: string; field: Field }[] {
    const result: { path: string; field: Field }[] = [];
    for (const field of fields) {
      // Skip non-named field types (row, collapsible, tabs)
      if (!('name' in field)) continue;

      const fieldPath = path ? `${path}.${field.name}` : field.name;

      if (field.type === 'text') {
        result.push({ path: fieldPath, field });
      } else if (field.type === 'group' && 'fields' in field) {
        result.push(...collectTextFields(field.fields, fieldPath));
      } else if (field.type === 'array' && 'fields' in field) {
        result.push(...collectTextFields(field.fields, `${fieldPath}[]`));
      }
    }
    return result;
  }

  for (const global of globals) {
    const textFields = collectTextFields(global.fields);
    if (textFields.length === 0) continue;

    it.each(textFields.map((tf) => [tf.path, tf.field]))(
      `${global.slug} — field "%s" has maxLength`,
      (_path, field) => {
        const f = field as Field & { maxLength?: number };
        expect(f.maxLength, `Field "${_path}" in ${global.slug} is missing maxLength`).toBeDefined();
        expect(f.maxLength).toBeGreaterThan(0);
      },
    );
  }
});
