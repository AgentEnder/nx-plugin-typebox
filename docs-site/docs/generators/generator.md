---
title: nx-plugin-typebox:generator
---

# nx-plugin-typebox:generator

generator generator

## Options

### <span className="required">description</span>

- (string): Generator description.

### <span className="required">path</span>

- (string): The file path to the generator. Relative to the current working directory.

### <span className="required">skipFormat</span>

- (boolean): Skip formatting files.

### <span className="required">skipLintChecks</span>

- (boolean): Do not add an eslint configuration for plugin json files.

### <span className="required">unitTestRunner</span>

- (undefined): Test runner to use for unit tests.

Default: `"jest"`

### name

- (string): The generator name to export in the plugin generators collection.
