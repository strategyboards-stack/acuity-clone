import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';

if (existsSync('dist')) rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('apps/web', 'dist/web', { recursive: true });
console.log('Build output written to dist/web');
