import { Type } from '@sinclair/typebox';

export const skipLintChecks = Type.Object({
  skipLintChecks: Type.Optional(
    Type.Boolean({
      default: false,
      description: 'Do not add an eslint configuration for plugin json files.',
    })
  ),
});
