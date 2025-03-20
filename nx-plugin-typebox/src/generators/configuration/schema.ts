import { Static, Type } from '@sinclair/typebox';

import { skipFormat } from '../../schema-fragments';

export const JSONSchema = Type.Composite([
  Type.Object({
    project: Type.String({
      description: 'The name of the plugin project to setup.',
      $default: {
        $source: 'argv',
        index: 0,
      },
      'x-prompt': 'What project would you like to add typebox support to?',
    }),
    targetName: Type.String({
      default: 'extract-schema',
    }),
  }),
  skipFormat,
]);

export type ConfigurationGeneratorSchema = Static<typeof JSONSchema>;
