import {
  formatFiles,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';

import { Value } from '@sinclair/typebox/value';

import { ConfigurationGeneratorSchema } from './schema';
import { JSONSchema as ExtractSchemaExecutorSchema } from '../../executors/extract-schema/schema';

export async function configurationGenerator(
  tree: Tree,
  options: ConfigurationGeneratorSchema
) {
  const project = readProjectConfiguration(tree, options.project);
  project.targets ??= {};
  project.targets[options.targetName] = {
    executor: 'nx-plugin-typebox:extract-schema',
    inputs: ['production', '^production', '!{projectRoot}/**/schema.json'],
    outputs: ['{projectRoot}/**/schema.json'],
    cache: true,
  };

  if (project.targets['build']) {
    project.targets['build'].dependsOn ??= [];
    project.targets['build'].dependsOn = [
      ...new Set([...project.targets.build.dependsOn, options.targetName]),
    ];
  }

  updateProjectConfiguration(tree, options.project, project);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export async function ensureConfiguration(tree: Tree, projectName: string) {
  const project = readProjectConfiguration(tree, projectName);
  let targetName: string | undefined;

  if (project.targets) {
    targetName = Object.keys(project.targets).find(
      (key) =>
        project.targets?.[key].executor === 'nx-plugin-typebox:extract-schema'
    );
  }

  if (!targetName) {
    targetName = 'extract-schema';
    await configurationGenerator(tree, {
      project: projectName,
      targetName,
      skipFormat: true,
    });
  }

  const targetConfig = readProjectConfiguration(tree, projectName).targets?.[
    targetName
  ];

  return Value.Parse(ExtractSchemaExecutorSchema, targetConfig);
}

export default configurationGenerator;
