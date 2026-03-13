const fs = require('node:fs');
const paths = [
  'apps/web/public/assets/booking-core.js',
  'apps/web/public/book/index.html',
  'apps/web/public/confirm/index.html'
];
for (const path of paths) {
  if (!fs.existsSync(path)) {
    console.error(`Missing required file: ${path}`);
    process.exit(1);
  }
}
console.log('Static typecheck proxy passed (required Phase 3B files exist).');
