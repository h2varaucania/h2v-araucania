'use server';

import { handleServerFunctions } from '@payloadcms/next/layouts';
import config from '@payload-config';
import { importMap } from './admin/importMap';

export const serverFunction: typeof handleServerFunctions = async (args) => {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};
