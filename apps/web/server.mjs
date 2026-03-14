import http from 'node:http';

const port = Number(process.env.PORT || 3000);

const routes = {
  '/': { status: 200, body: 'acuity-clone web shell' },
  '/client': { status: 200, body: 'client self-service shell' },
  '/account/authenticated-shell': { status: 200, body: 'authenticated account shell' }
};

const server = http.createServer((req, res) => {
  const route = routes[req.url] || { status: 404, body: 'not found' };
  res.writeHead(route.status, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(route.body);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[web] listening on http://0.0.0.0:${port}`);
});
