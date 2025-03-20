import { Type } from '@sinclair/typebox';

export const unitTestRunner = Type.Object({
  unitTestRunner: Type.Unsafe<'jest' | 'vitest' | 'none'>({
    enum: ['jest', 'vitest', 'none'],
    description: 'Test runner to use for unit tests.',
    default: 'jest',
  }),
});
