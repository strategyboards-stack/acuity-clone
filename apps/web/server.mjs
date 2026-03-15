import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { deriveCalendarState } from './src/admin-calendar.js';
import { verifyAdminSession } from './src/auth-session.js';

const style = readFileSync(resolve('apps/web/static/styles.css'), 'utf8');

function page(body) {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${style}</style></head><body>${body}</body></html>`;
}

export function createAppServer() {
  return createServer((req, res) => {
    if (req.url === '/login') {
      res.end(page('<main><h1>Login required</h1><p>Admin routes require a validated server session.</p></main>'));
      return;
    }

    if (req.url === '/admin/calendar') {
      if (!verifyAdminSession(req)) {
        res.statusCode = 302;
        res.setHeader('Location', '/login');
        res.end();
        return;
      }

      const state = deriveCalendarState();
      const list = state.filtered.map((a) => `<li><strong>${a.clientName}</strong> — ${a.serviceName}</li>`).join('');
      const active = state.active;

      res.end(page(`<main><h1>Admin Calendar</h1><p>Shell separated from client/public flows.</p><section><button>day</button><button class="active">week</button><button>month</button></section><section class="grid"><div><h2>week view foundation</h2><input placeholder="Search appointments"/><select><option>All staff</option></select><button>Manual create appointment</button><ul>${list}</ul></div><aside><h2>Appointment detail panel foundation</h2><p>Client: ${active.clientName}</p><p>Service: ${active.serviceName}</p><p>Staff: ${active.staffMemberName}</p></aside></section></main>`));
      return;
    }

    res.end(page('<main><h1>Acuity Clone</h1><a href="/admin/calendar">Go to admin calendar</a></main>'));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createAppServer().listen(3000, '0.0.0.0', () => {
    console.log('Server listening on http://0.0.0.0:3000');
  });
}
