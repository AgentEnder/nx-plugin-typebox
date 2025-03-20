import { formatFiles, joinPathFragments, Tree } from '@nx/devkit';
import { ExecutorGeneratorSchema } from './schema';
import { executorGenerator as nxExecutorGenerator } from '@nx/plugin/generators';
import { relative } from 'path';
import { ensureConfiguration } from '../configuration/configuration';
import { findProjectByInnerPath } from '../utils/find-project-by-inner-path';

export async function executorGenerator(
  tree: Tree,
  options: ExecutorGeneratorSchema
) {
  const cwdRelativeToWorkspaceRoot = relative(tree.root, process.cwd());
  const executorRootPath = joinPathFragments(
    cwdRelativeToWorkspaceRoot,
    options.path
  );
  const projectName = findProjectByInnerPath(tree, executorRootPath);
  const config = await ensureConfiguration(tree, projectName);

  const task = await nxExecutorGenerator(tree, {
    ...options,
    skipFormat: true,
  });

  tree.delete(joinPathFragments(executorRootPath, 'schema.d.ts'));
  tree.write(
    joinPathFragments(executorRootPath, config.schemaFile),
    `import {Type} from '@sinclair/typebox';
    
    export const ${config.exportName} = Type.Object({
      name: Type.String(),
    });`
  );

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default executorGenerator;
