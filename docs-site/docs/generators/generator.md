---
title: nx-plugin-typebox:generator
---

# nx-plugin-typebox:generator

## Generator Generator

Generates a generator setup with typebox for a plugin.

## Options

### <span className="required">path</span>

- (string): The file path to the generator. Relative to the current working directory.

### description

- (string): Generator description.

### name

- (string): The generator name to export in the plugin generators collection.

### skipFormat

- (boolean): Skip formatting files.

### skipLintChecks

- (boolean): Do not add an eslint configuration for plugin json files.

### unitTestRunner

- (undefined): Test runner to use for unit tests.

Default: `"jest"`
