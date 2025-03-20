import { Type, type Static } from '@sinclair/typebox';

import {
  unitTestRunner,
  path,
  name,
  description,
  skipFormat,
  skipLintChecks,
} from '../../schema-fragments';

export const JSONSchema = Type.Composite(
  [
    path('generator'),
    name('generator'),
    description('Generator'),
    unitTestRunner,
    skipFormat,
    skipLintChecks,
  ],
  {
    title: 'Generator Generator',
    description: 'Generates a generator setup with typebox for a plugin.',
  }
);

export type GeneratorGeneratorSchema = Static<typeof JSONSchema>;
