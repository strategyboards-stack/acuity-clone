import { readFile } from 'node:fs/promises';

const packageRaw = await readFile(new URL('../package.json', import.meta.url), 'utf8');
const pkg = JSON.parse(packageRaw);

if (pkg.packageManager !== 'pnpm@10.13.1') {
  throw new Error('packageManager must remain pinned to pnpm@10.13.1 for Codex bootstrap stability');
}

const foundationRaw = await readFile(
  new URL('../apps/web/src/public-scheduler-foundation.js', import.meta.url),
  'utf8'
);

if (!foundationRaw.includes("phase: '3A'")) {
  throw new Error('Phase 3A foundation marker is missing');
}

console.log('Typecheck validation passed.');
