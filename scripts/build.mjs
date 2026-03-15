import { mkdirSync, cpSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('apps/web', 'dist/web', { recursive: true });
cpSync('packages/contracts', 'dist/contracts', { recursive: true });
console.log('Build artifacts generated under dist/.');
