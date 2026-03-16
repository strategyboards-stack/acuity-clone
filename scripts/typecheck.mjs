import fs from 'node:fs';
const required = [
  'apps/web/public/admin/calendar/index.html',
  'apps/web/public/booking/demo/index.html',
  'apps/web/public/client/index.html',
  'apps/web/public/assets/styles.css',
  'apps/web/public/assets/app.js'
];
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}
console.log('typecheck passed');
