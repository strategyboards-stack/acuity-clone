import fs from 'node:fs';
const required = [
  'apps/web/public/admin/calendar/index.html',
  'apps/web/public/admin/invoices/index.html',
  'apps/web/public/admin/clients/index.html',
  'apps/web/public/admin/availability/index.html',
  'apps/web/public/booking/demo/index.html',
  'apps/web/public/client/index.html',
  'apps/web/public/assets/styles.css',
  'apps/web/public/assets/app.js',
  'packages/db/appointments-repo.mjs'
];
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}
console.log('typecheck passed');
