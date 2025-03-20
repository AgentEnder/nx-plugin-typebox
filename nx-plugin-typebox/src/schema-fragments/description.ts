import { Type } from '@sinclair/typebox';

export const description = (identifier: string) =>
  Type.Object({
    description: Type.Optional(
      Type.String({
        description: `${identifier} description.`,
        'x-priority': 'important',
      })
    ),
  });
