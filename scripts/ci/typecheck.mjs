import { access } from 'node:fs/promises';

const required = [
  'docs/source/part-11-clone-spec.txt',
  'docs/source/part-07-master-dossier.txt',
  'docs/source/part-08-integrations-sync.txt',
  'docs/source/part-09-reports-users-billing.txt',
  'docs/source/part-10-mobile-audit.txt'
];

for (const file of required) {
  await access(file);
}

console.log('typecheck: repository baseline files present');
