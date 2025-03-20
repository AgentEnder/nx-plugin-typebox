import {
  formatFiles,
  joinPathFragments,
  names,
  Tree,
  workspaceRoot,
} from '@nx/devkit';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';
import { GeneratorGeneratorSchema } from './schema';

import { generatorGenerator as nxGeneratorGenerator } from '@nx/plugin/generators';
import { relative } from 'path';
import { ensureConfiguration } from '../configuration/configuration';
import { findProjectByInnerPath } from '../utils/find-project-by-inner-path';

export async function generatorGenerator(
  tree: Tree,
  options: GeneratorGeneratorSchema
) {
  const cwdRelativeToWorkspaceRoot = relative(workspaceRoot, process.cwd());
  const generatorRootPath = joinPathFragments(
    cwdRelativeToWorkspaceRoot,
    options.path,
    '..'
  );
  const projectName = findProjectByInnerPath(tree, generatorRootPath);
  const config = await ensureConfiguration(tree, projectName);

  const { artifactName: generatorName } =
    await determineArtifactNameAndDirectoryOptions(tree, options);

  const { className } = names(generatorName);

  const task = await nxGeneratorGenerator(tree, {
    ...options,
    skipFormat: true,
    unitTestRunner: options.unitTestRunner ?? 'jest',
  });

  tree.delete(joinPathFragments(generatorRootPath, 'schema.d.ts'));
  tree.write(
    joinPathFragments(generatorRootPath, config.schemaFile),
    `import { Type, type Static } from '@sinclair/typebox';
  
  export const ${config.exportName} = Type.Object({
    name: Type.String(),
  });
  
  export type ${className}GeneratorSchema = Static<typeof ${config.exportName}>;`
  );

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default generatorGenerator;
