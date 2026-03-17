import fs from 'node:fs';
import path from 'node:path';

const ensureStore = (file) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]\n', 'utf8');
};

const readAll = (file) => {
  ensureStore(file);
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = JSON.parse(raw || '[]');
  return Array.isArray(parsed) ? parsed : [];
};

const writeAll = (file, rows) => {
  fs.writeFileSync(file, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
};

export const listAppointments = (file) => readAll(file);

export const createAppointment = (file, input) => {
  const rows = readAll(file);
  const appointment = {
    id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    appointmentType: input.appointmentType,
    date: input.date,
    time: input.time,
    source: input.source || 'public-booking'
  };
  rows.push(appointment);
  writeAll(file, rows);
  return appointment;
};
