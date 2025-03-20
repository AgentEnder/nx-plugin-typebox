---
title: nx-plugin-typebox:extract-schema
---

# nx-plugin-typebox:extract-schema

extract-schema executor

## Options

### <span className="required">exportName</span>

- (string): The name of the export in the schema file which contains the raw JSON schema.

Default: `"JSONSchema"`

### <span className="required">schemaFile</span>

- (string): The file path to the typescript file containing the schema. Relative to the executor/generator's root directory. For example, `schema.ts` would be the proper value if your plugin contains generators laid out as `./src/generators/[generator-name]/(schema.ts|schema.json)`.

Default: `"schema.ts"`
