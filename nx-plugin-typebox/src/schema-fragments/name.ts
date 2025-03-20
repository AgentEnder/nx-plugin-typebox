import { Type } from '@sinclair/typebox';

export const name = (identifier: string) =>
  Type.Object({
    name: Type.Optional(
      Type.String({
        description: `The ${identifier} name to export in the plugin ${identifier}s collection.`,
      })
    ),
  });
