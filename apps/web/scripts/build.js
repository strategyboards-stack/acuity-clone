const fs = require('node:fs');
const path = require('node:path');

const src = path.resolve('apps/web/public');
const out = path.resolve('apps/web/dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const outPath = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, outPath);
    else fs.copyFileSync(srcPath, outPath);
  }
}

copyDir(src, out);
console.log('Build complete:', out);
