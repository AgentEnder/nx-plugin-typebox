import {
  formatFiles,
  joinPathFragments,
  names,
  Tree,
} from '@nx/devkit';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';
import { GeneratorGeneratorSchema } from './schema';

import { generatorGenerator as nxGeneratorGenerator } from '@nx/plugin/generators';
import { ensureConfiguration } from '../configuration/configuration';
import { findProjectByInnerPath } from '../utils/find-project-by-inner-path';

export async function generatorGenerator(
  tree: Tree,
  options: GeneratorGeneratorSchema
) {
  const {
    artifactName: generatorName,
    directory: initialDirectory,
  } = await determineArtifactNameAndDirectoryOptions(tree, options);

  // Replicate the nesting logic from @nx/plugin's normalizeOptions:
  // if the last path segment matches the artifact name and has no file extension,
  // Nx treats it as a directory path and nests the artifact inside it.
  let generatorRootPath = initialDirectory;
  const normalizedPath = options.path.replace(/^\.?\//, '').replace(/\/$/, '');
  const lastSegment = normalizedPath.split('/').pop();
  const knownFileExtensions = ['.ts', '.js', '.jsx', '.tsx'];
  if (
    !knownFileExtensions.some((ext) => lastSegment.endsWith(ext)) &&
    lastSegment === generatorName
  ) {
    generatorRootPath = joinPathFragments(initialDirectory, generatorName);
  }

  const projectName = findProjectByInnerPath(tree, generatorRootPath);
  const config = await ensureConfiguration(tree, projectName);

  const { className, fileName } = names(generatorName);

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

  if (config.schemaFile !== 'schema.ts') {
    const implPath = joinPathFragments(generatorRootPath, `${fileName}.ts`);
    const generatorSourceContents = tree.read(implPath, 'utf-8');

    tree.write(
      implPath,
      generatorSourceContents.replace(
        './schema',
        `./${config.schemaFile.split('.').slice(0, -1).join('.')}`
      )
    );
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default generatorGenerator;
