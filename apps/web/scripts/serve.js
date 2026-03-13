const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve('apps/web/public');
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  if (!pathname.includes('.')) pathname += '/index.html';
  const file = path.join(root, pathname);
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  const ext = path.extname(file);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  res.writeHead(200, { 'content-type': types[ext] || 'text/plain' });
  res.end(fs.readFileSync(file));
});
server.listen(3000, () => console.log('Listening on 3000'));
