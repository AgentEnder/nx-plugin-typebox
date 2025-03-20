import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { mkdirSync, rmSync } from 'fs';
import { NX_VERSION } from '@nx/devkit';

process.env.NX_DAEMON = 'false';

describe('nx-plugin-typebox', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`npm install -D nx-plugin-typebox@e2e @nx/plugin@${NX_VERSION}`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });
  });

  afterAll(() => {
    // if (projectDirectory) {
    //   // Cleanup the test project
    //   rmSync(projectDirectory, {
    //     recursive: true,
    //     force: true,
    //   });
    // }
  });

  it('should work on simple generators and executors', () => {
    const pluginName = uniq('test-plugin');
    // npm ls will fail if the package is not installed properly
    execSync(
      `npx nx g @nx/plugin:plugin packages/${pluginName} --no-interactive`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
      }
    );
    execSync(
      `npx nx g nx-plugin-typebox:generator packages/${pluginName}/src/generators/test/test --no-interactive`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
      }
    );
    execSync(
      `npx nx g nx-plugin-typebox:executor packages/${pluginName}/src/executors/test/test --no-interactive`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
      }
    );
    rmSync(
      join(
        projectDirectory,
        `packages/${pluginName}/src/generators/test/schema.json`
      )
    );
    rmSync(
      join(
        projectDirectory,
        `packages/${pluginName}/src/executors/test/schema.json`
      )
    );
    const output = execSync(`npx nx extract-schema ${pluginName}`, {
      cwd: projectDirectory,
      stdio: 'pipe',
    });
    expect(output.toString()).toContain(
      `Updated schemas for 2 of 2 generators and executors in ${pluginName}`
    );
    execSync(`npx nx build ${pluginName}`, {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  it('should work with custom config', () => {
    const pluginName = uniq('test-plugin');
    // npm ls will fail if the package is not installed properly
    execSync(
      `npx nx g @nx/plugin:plugin packages/${pluginName} --no-interactive`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
      }
    );
    execSync(
      `npx nx g nx-plugin-typebox:configuration ${pluginName} --schemaFile custom-schema.ts --export-name schema --no-interactive`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
      }
    );
    execSync(
      `npx nx g nx-plugin-typebox:generator packages/${pluginName}/src/generators/test/test --no-interactive`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
      }
    );
    execSync(
      `npx nx g nx-plugin-typebox:executor packages/${pluginName}/src/executors/test/test --no-interactive`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
      }
    );
    rmSync(
      join(
        projectDirectory,
        `packages/${pluginName}/src/generators/test/schema.json`
      )
    );
    rmSync(
      join(
        projectDirectory,
        `packages/${pluginName}/src/executors/test/schema.json`
      )
    );
    const output = execSync(`npx nx extract-schema ${pluginName}`, {
      cwd: projectDirectory,
      stdio: 'pipe',
    });
    expect(output.toString()).toContain(
      `Updated schemas for 2 of 2 generators and executors in ${pluginName}`
    );
    execSync(`npx nx build ${pluginName}`, {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });
});

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
function createTestProject() {
  const projectName = 'test-project';
  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(
    `npx -y create-nx-workspace@${NX_VERSION} ${projectName} --preset apps --nxCloud=skip --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    }
  );
  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}

function uniq(str: string) {
  return `${str}-${Math.random().toString(36).substring(7)}`;
}
