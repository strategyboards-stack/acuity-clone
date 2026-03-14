import { spawn } from 'node:child_process';

const port = Number(process.env.PORT || 3000);

const server = spawn('node', ['apps/web/server.mjs'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let started = false;

const waitForStart = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    reject(new Error('server did not start in time'));
  }, 10000);

  server.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    process.stdout.write(text);
    if (text.includes('[web] listening')) {
      started = true;
      clearTimeout(timeout);
      resolve();
    }
  });

  server.stderr.on('data', (chunk) => process.stderr.write(chunk.toString()));
  server.on('exit', (code) => {
    if (!started) {
      clearTimeout(timeout);
      reject(new Error(`server exited before start with code ${code}`));
    }
  });
});

try {
  await waitForStart;

  const clientRes = await fetch(`http://127.0.0.1:${port}/client`);
  const clientBody = await clientRes.text();
  if (clientRes.status !== 200 || !clientBody.includes('self-service')) {
    throw new Error(`client route validation failed: ${clientRes.status} ${clientBody}`);
  }

  const shellRes = await fetch(`http://127.0.0.1:${port}/account/authenticated-shell`);
  const shellBody = await shellRes.text();
  if (shellRes.status !== 200 || !shellBody.includes('authenticated')) {
    throw new Error(`shell route validation failed: ${shellRes.status} ${shellBody}`);
  }

  console.log('smoke: client self-service and authenticated shell routes passed');
} finally {
  server.kill('SIGTERM');
}
