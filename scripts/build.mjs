import { mkdirSync, cpSync } from 'node:fs';
mkdirSync('dist/apps/api', { recursive: true });
mkdirSync('dist/packages/contracts', { recursive: true });
cpSync('apps/api/src', 'dist/apps/api/src', { recursive: true });
cpSync('packages/contracts/src', 'dist/packages/contracts/src', { recursive: true });
console.log('Build completed: copied runtime sources to dist/.');
