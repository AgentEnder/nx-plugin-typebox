---
title: nx-plugin-typebox:executor
---

# nx-plugin-typebox:executor

executor generator

## Options

### <span className="required">description</span>

- (string): Executor description.

### <span className="required">includeHasher</span>

- (boolean): Should the boilerplate for a custom hasher be generated?

### <span className="required">path</span>

- (string): The file path to the executor. Relative to the current working directory.

### <span className="required">skipFormat</span>

- (boolean): Skip formatting files.

### <span className="required">skipLintChecks</span>

- (boolean): Do not add an eslint configuration for plugin json files.

### <span className="required">unitTestRunner</span>

- (undefined): Test runner to use for unit tests.

Default: `"jest"`

### name

- (string): The executor name to export in the plugin executors collection.
