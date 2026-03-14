import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('workspace pins pnpm package manager', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(packageJson.packageManager, 'pnpm@10.13.1');
});

test('workspace includes web app package', async () => {
  const appPackageJson = JSON.parse(await readFile('apps/web/package.json', 'utf8'));
  assert.equal(appPackageJson.name, '@acuity/web');
});
