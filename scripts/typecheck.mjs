import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const roots = ['apps', 'packages'];
const files = [];

const walk = (dir) => {
  for (const item of readdirSync(dir)) {
    const full = join(dir, item);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full);
      continue;
    }
    if (full.endsWith('.js')) files.push(full);
  }
};

roots.forEach((root) => walk(root));

for (const file of files) {
  const result = spawnSync('node', ['--check', file], { stdio: 'pipe', encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
}

console.log(`Typecheck-like syntax validation passed for ${files.length} JS files.`);
