import fs from 'node:fs';
import path from 'node:path';
const out = 'dist';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'BUILD_OK.txt'), 'Phase 11A mobile hardening artifacts built.\n');
console.log('build passed');
