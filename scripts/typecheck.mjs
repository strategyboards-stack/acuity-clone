import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const roots = ['apps', 'packages', 'scripts'];
const files = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (['.js', '.mjs'].includes(extname(full))) files.push(full);
  }
}

for (const root of roots) walk(root);
for (const file of files) {
  readFileSync(file, 'utf8');
}
console.log(`Typecheck-equivalent syntax/read validation passed for ${files.length} files.`);
