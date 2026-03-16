import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const waitForServer = (proc) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('server boot timeout')), 7000);
  proc.stdout.on('data', (d) => {
    if (String(d).includes('web running on')) {
      clearTimeout(timer);
      resolve();
    }
  });
  proc.on('exit', (code) => {
    clearTimeout(timer);
    reject(new Error(`server exited early: ${code}`));
  });
});

test('POST /api/appointments persists booking and GET returns it', async () => {
  const port = 3210;
  const dataFile = path.resolve('data/test-appointments.json');
  if (fs.existsSync(dataFile)) fs.unlinkSync(dataFile);

  const proc = spawn('node', ['apps/web/server.mjs'], {
    env: { ...process.env, PORT: String(port), APPOINTMENTS_FILE: dataFile },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    await waitForServer(proc);

    const payload = {
      firstName: 'Ava',
      lastName: 'Stone',
      email: 'ava@example.com',
      appointmentType: 'Initial consultation',
      date: '2026-03-30',
      time: '10:00',
      source: 'public-booking'
    };

    const post = await fetch(`http://127.0.0.1:${port}/api/appointments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    assert.equal(post.status, 201);
    const postJson = await post.json();
    assert.ok(postJson.appointment.id);

    const get = await fetch(`http://127.0.0.1:${port}/api/appointments`);
    assert.equal(get.status, 200);
    const getJson = await get.json();
    assert.equal(getJson.appointments.length, 1);
    assert.equal(getJson.appointments[0].email, 'ava@example.com');

    const disk = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    assert.equal(disk.length, 1);
    assert.equal(disk[0].appointmentType, 'Initial consultation');
  } finally {
    proc.kill('SIGTERM');
    if (fs.existsSync(dataFile)) fs.unlinkSync(dataFile);
  }
});
