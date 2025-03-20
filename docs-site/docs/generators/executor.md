---
title: nx-plugin-typebox:executor
---

# nx-plugin-typebox:executor

executor generator

## Options

### <span className="required">includeHasher</span>

- (boolean): Should the boilerplate for a custom hasher be generated?

### <span className="required">path</span>

- (string): The file path to the executor. Relative to the current working directory.

### description

- (string): Executor description.

### name

- (string): The executor name to export in the plugin executors collection.

### skipFormat

- (boolean): Skip formatting files.

### skipLintChecks

- (boolean): Do not add an eslint configuration for plugin json files.

### unitTestRunner

- (undefined): Test runner to use for unit tests.

Default: `"jest"`
