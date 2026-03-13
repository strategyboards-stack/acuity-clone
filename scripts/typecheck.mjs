import { execSync } from 'node:child_process';
execSync('node --check apps/api/src/scheduling-config/service.js', { stdio: 'inherit' });
execSync('node --check packages/contracts/src/scheduling-config.js', { stdio: 'inherit' });
