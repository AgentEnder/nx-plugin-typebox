import { Type } from '@sinclair/typebox';

export const skipFormat = Type.Object({
  skipFormat: Type.Boolean({
    description: 'Skip formatting files.',
    default: false,
    'x-priority': 'internal',
  }),
});
