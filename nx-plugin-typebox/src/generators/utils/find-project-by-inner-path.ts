import { getProjects, Tree } from '@nx/devkit';
import { dirname } from 'node:path/posix';

export function findProjectByInnerPath(
  tree: Tree,
  innerPath: string
): string | undefined {
  const projects = getProjects(tree);
  const projectRootMap = new Map(
    [...projects.entries()].map(([k, v]) => [v.root, k])
  );

  let current = innerPath;
  let next = dirname(innerPath);
  while (current !== next) {
    const projectName = projectRootMap.get(next);
    if (projectName) {
      return projectName;
    }
    current = next;
    next = dirname(current);
  }

  return undefined;
}
