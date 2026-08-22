import { describe, it, expect } from 'vitest';
import type { CollectionConfig } from 'payload';

import { CapasGeo } from '@/collections/CapasGeo';
import { Documentos } from '@/collections/Documentos';
import { Downloads } from '@/collections/Downloads';
import { Eventos } from '@/collections/Eventos';
import { Media } from '@/collections/Media';
import { Miembros } from '@/collections/Miembros';
import { Noticias } from '@/collections/Noticias';
import { Proyectos } from '@/collections/Proyectos';
import { Users } from '@/collections/Users';

const collections: CollectionConfig[] = [
  CapasGeo,
  Documentos,
  Downloads,
  Eventos,
  Media,
  Miembros,
  Noticias,
  Proyectos,
  Users,
];

describe('Collection configs', () => {
  it.each(collections.map((c) => [c.slug, c]))(
    '%s has labels in Spanish',
    (_slug, collection) => {
      const c = collection as CollectionConfig;
      expect(c.labels).toBeDefined();
      expect(c.labels!.singular).toBeTruthy();
      expect(c.labels!.plural).toBeTruthy();
      // Verify labels are not the default English slug-based names
      expect(c.labels!.singular).not.toBe(c.slug);
    },
  );

  it.each(collections.map((c) => [c.slug, c]))(
    '%s has admin.description',
    (_slug, collection) => {
      const c = collection as CollectionConfig;
      expect(c.admin?.description).toBeTruthy();
      expect(typeof c.admin!.description).toBe('string');
      expect((c.admin!.description as string).length).toBeGreaterThan(10);
    },
  );

  it.each(collections.map((c) => [c.slug, c]))(
    '%s has admin.group',
    (_slug, collection) => {
      const c = collection as CollectionConfig;
      expect(c.admin?.group).toBeTruthy();
    },
  );
});

describe('Downloads collection is read-only', () => {
  it('create access returns false', () => {
    const createFn = Downloads.access?.create;
    expect(createFn).toBeDefined();
    // The create function always returns false regardless of arguments
    const result = (createFn as (args: unknown) => boolean)({ req: { user: { role: 'admin' } } });
    expect(result).toBe(false);
  });

  it('update access returns false', () => {
    const updateFn = Downloads.access?.update;
    expect(updateFn).toBeDefined();
    const result = (updateFn as (args: unknown) => boolean)({ req: { user: { role: 'admin' } } });
    expect(result).toBe(false);
  });
});
