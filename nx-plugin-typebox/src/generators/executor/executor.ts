import { formatFiles, joinPathFragments, names, Tree } from '@nx/devkit';
import { ExecutorGeneratorSchema } from './schema';
import { executorGenerator as nxExecutorGenerator } from '@nx/plugin/generators';
import { relative } from 'path';
import { ensureConfiguration } from '../configuration/configuration';
import { findProjectByInnerPath } from '../utils/find-project-by-inner-path';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';

export async function executorGenerator(
  tree: Tree,
  options: ExecutorGeneratorSchema
) {
  const cwdRelativeToWorkspaceRoot = relative(tree.root, process.cwd());
  const executorRootPath = joinPathFragments(
    cwdRelativeToWorkspaceRoot,
    options.path,
    '..'
  );
  const projectName = findProjectByInnerPath(tree, executorRootPath);
  const config = await ensureConfiguration(tree, projectName);

  const { artifactName: executorName } =
    await determineArtifactNameAndDirectoryOptions(tree, options);

  const { className, fileName } = names(executorName);

  const task = await nxExecutorGenerator(tree, {
    ...options,
    skipFormat: true,
    unitTestRunner: options.unitTestRunner ?? 'jest',
  });

  tree.delete(joinPathFragments(executorRootPath, 'schema.d.ts'));
  tree.write(
    joinPathFragments(executorRootPath, config.schemaFile),
    `import {Type} from '@sinclair/typebox';
    
    export const ${config.exportName} = Type.Object({
      name: Type.String(),
    });
    
    export type ${className}ExecutorSchema = typeof ${config.exportName};`
  );

  if (config.schemaFile !== 'schema.ts') {
    const implPath = joinPathFragments(executorRootPath, `${fileName}.ts`);
    const executorSourceContents = tree.read(implPath, 'utf-8');

    tree.write(
      implPath,
      executorSourceContents.replace(
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

export default executorGenerator;
