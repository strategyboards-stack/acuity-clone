import { mkdirSync, copyFileSync } from 'node:fs';
mkdirSync('dist', { recursive: true });
copyFileSync('apps/api/src/scheduling-config/service.js', 'dist/scheduling-config.service.js');
