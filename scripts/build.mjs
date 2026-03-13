import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = await readFile(
  new URL('../apps/web/src/public-scheduler-foundation.js', import.meta.url),
  'utf8'
);

await mkdir(new URL('../dist', import.meta.url), { recursive: true });
await writeFile(
  new URL('../dist/phase-3a-build.txt', import.meta.url),
  `Phase 3A build artifact generated.\n\n${source}`,
  'utf8'
);

console.log('Build completed: dist/phase-3a-build.txt');
