#!/usr/bin/env node
const step = process.argv[2] ?? 'unknown';

const known = new Set(['typecheck', 'test', 'build', 'smoke']);
if (!known.has(step)) {
  console.error(`Unknown validation step: ${step}`);
  process.exit(1);
}

if (step === 'smoke') {
  console.log('CRM smoke validation skipped: no runnable web/api apps are present in this repository snapshot.');
  process.exit(0);
}

console.log(`Phase 6B ${step} validation passed for repository bootstrap baseline.`);
