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
  path('executor'),
  name('executor'),
  description('Executor'),
  unitTestRunner,
  skipFormat,
  skipLintChecks,
  Type.Object({
    includeHasher: Type.Boolean({
      default: false,
      description: 'Should the boilerplate for a custom hasher be generated?',
    }),
  }),
]);

export type ExecutorGeneratorSchema = Static<typeof JSONSchema>;
