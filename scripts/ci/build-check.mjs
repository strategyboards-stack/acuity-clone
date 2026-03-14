import { access } from 'node:fs/promises';

const required = [
  'apps/web/server.mjs',
  'package.json',
  'pnpm-workspace.yaml'
];

for (const file of required) {
  await access(file);
}

console.log('build: phase 4B bootstrap artifacts verified');
