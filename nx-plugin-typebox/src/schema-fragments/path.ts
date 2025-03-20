import { Type } from '@sinclair/typebox';

export const path = (identifier: string) =>
  Type.Object({
    path: Type.Required(
      Type.String({
        description: `The file path to the ${identifier}. Relative to the current working directory.`,
        $default: {
          $source: 'argv',
          index: 0,
        },
        'x-prompt': `What is the ${identifier}?`,
        'x-priority': 'important',
      })
    ),
  });
