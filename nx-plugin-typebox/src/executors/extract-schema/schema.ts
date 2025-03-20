import { Type, type Static } from '@sinclair/typebox';

export const JSONSchema = Type.Object(
  {
    exportName: Type.String({
      default: 'JSONSchema',
      description:
        'The name of the export in the schema file which contains the raw JSON schema.',
    }),
    schemaFile: Type.String({
      description:
        "The file path to the typescript file containing the schema. Relative to the executor/generator's root directory. For example, `schema.ts` would be the proper value if your plugin contains generators laid out as `./src/generators/[generator-name]/(schema.ts|schema.json)`.",
      default: 'schema.ts',
    }),
  },
  {
    title: 'Extract Schema Executor',
    description: 'Extracts the JSON schema from the schema file.',
  }
);

export type ExtractSchemaExecutorSchema = Static<typeof JSONSchema>;
