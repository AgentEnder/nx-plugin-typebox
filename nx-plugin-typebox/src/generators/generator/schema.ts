import { Type, type Static } from '@sinclair/typebox';

import {
  unitTestRunner,
  path,
  name,
  description,
  skipFormat,
  skipLintChecks,
} from '../../schema-fragments';

export const JSONSchema = Type.Composite([
  path('generator'),
  name('generator'),
  description('Generator'),
  unitTestRunner,
  skipFormat,
  skipLintChecks,
]);

export type GeneratorGeneratorSchema = Static<typeof JSONSchema>;
