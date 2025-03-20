import {
  ExecutorsJson,
  GeneratorsJson,
  joinPathFragments,
  logger,
  PromiseExecutor,
  readJsonFile,
  writeJsonFile,
} from '@nx/devkit';
import { ExtractSchemaExecutorSchema } from './schema';
import { resolve } from 'node:path';

type GeneratorsJsonEntry =
  GeneratorsJson['generators'][keyof GeneratorsJson['generators']];
type ExecutorsJsonEntry =
  ExecutorsJson['executors'][keyof ExecutorsJson['executors']];

import { existsSync } from 'node:fs';

const runExecutor: PromiseExecutor<ExtractSchemaExecutorSchema> = async (
  options,
  context
) => {
  const projectConfig = context.projectGraph.nodes[context.projectName].data;
  const projectRoot = projectConfig.root;
  const projectPackageJson = readJsonFile(
    resolve(context.root, projectRoot, 'package.json')
  );
  const { generators, executors } = projectPackageJson;

  let overallTotal = 0;
  let overallChanged = 0;

  const tsx: typeof import('tsx/cjs/api') = require('tsx/cjs/api');
  const unregister = tsx.register();

  if (generators) {
    const { total, changed } = extractSchemaForCollectionFile(
      options,
      resolve(context.root, projectRoot, generators),
      'generators'
    );
    overallTotal += total;
    overallChanged += changed;
  }
  if (executors) {
    const { total, changed } = extractSchemaForCollectionFile(
      options,
      resolve(context.root, projectRoot, executors),
      'executors'
    );
    overallTotal += total;
    overallChanged += changed;
  }

  unregister();

  if (overallTotal === 0) {
    logger.warn(
      `No generators or executors found in ${context.projectName} to extract schemas from`
    );
  } else {
    logger.info(
      `Updated schemas for ${overallChanged} of ${overallTotal} generators and executors in ${context.projectName}`
    );
  }

  return {
    success: true,
  };
};

function extractSchemaForCollectionFile<T extends 'generators' | 'executors'>(
  options: ExtractSchemaExecutorSchema,
  collectionsFilePath: string,
  type: T
) {
  let total = 0;
  let changed = 0;

  const collection = readJsonFile(collectionsFilePath);

  const entries =
    type === 'generators'
      ? (collection.generators as GeneratorsJson['generators'])
      : (collection.executors as ExecutorsJson['executors']);

  for (const [name, entry] of Object.entries(entries) as [
    string,
    GeneratorsJsonEntry | ExecutorsJsonEntry
  ][]) {
    if (typeof entry === 'string') {
      logger.warn(
        `Skipping ${collectionsFilePath} entry ${name} as it is a string`
      );
    } else {
      const schemaPath = joinPathFragments(
        resolve(collectionsFilePath, '..'),
        entry.schema
      );
      const tsSchemaPath = joinPathFragments(
        schemaPath,
        '..',
        options.schemaFile ?? 'schema.ts'
      );
      try {
        const schema = require(tsSchemaPath);
        const schemaExport = schema[options.exportName ?? 'JSONSchema'];
        if (!schemaExport) {
          logger.warn(
            `Skipping ${collectionsFilePath} entry ${name} as the schema file ${tsSchemaPath} does not contain an export named ${options.exportName}`
          );
        }
        total += 1;
        let shouldUpdate = false;
        if (existsSync(schemaPath)) {
          const existingSchema = readJsonFile(schemaPath);
          if (JSON.stringify(existingSchema) !== JSON.stringify(schemaExport)) {
            shouldUpdate = true;
          }
        } else {
          shouldUpdate = true;
        }
        if (shouldUpdate) {
          changed += 1;
          writeJsonFile(schemaPath, schemaExport);
        }
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          logger.warn(
            `Skipping ${collectionsFilePath} entry ${name} as the schema file ${tsSchemaPath} could not be found`
          );
        }
      }
    }
  }
  return { total, changed };
}

export default runExecutor;
