import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createAppointment, listAppointments } from '../../packages/db/appointments-repo.mjs';

const port = Number(process.env.PORT || 3000);
const root = path.resolve('apps/web/public');
const appointmentsFile = path.resolve(process.env.APPOINTMENTS_FILE || 'data/appointments.json');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const routeFile = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  if (clean === '/' || clean === '') return 'index.html';
  const mapped = clean.replace(/^\//, '');
  if (mapped.endsWith('/')) return `${mapped}index.html`;
  if (!path.extname(mapped)) return `${mapped}/index.html`;
  return mapped;
};

const sendJson = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

const parseBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

const validateAppointment = (payload) => {
  const required = ['firstName', 'lastName', 'email', 'appointmentType', 'date', 'time'];
  for (const field of required) {
    if (!payload[field] || typeof payload[field] !== 'string') return `Missing ${field}`;
  }
  return null;
};

http.createServer(async (req, res) => {
  const method = req.method || 'GET';
  const urlPath = (req.url || '/').split('?')[0];

  if (method === 'GET' && urlPath === '/api/appointments') {
    return sendJson(res, 200, { appointments: listAppointments(appointmentsFile) });
  }

  if (method === 'POST' && urlPath === '/api/appointments') {
    try {
      const payload = await parseBody(req);
      const error = validateAppointment(payload);
      if (error) return sendJson(res, 400, { error });
      const appointment = createAppointment(appointmentsFile, payload);
      return sendJson(res, 201, { appointment });
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON body' });
    }
  }

  const file = path.join(root, routeFile(req.url || '/'));
  if (!file.startsWith(root)) {
    res.writeHead(400).end('Bad path');
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, {'content-type': 'text/plain; charset=utf-8'}).end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'text/plain; charset=utf-8' });
    res.end(data);
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`web running on ${port}`);
});
