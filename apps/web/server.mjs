import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = Number(process.env.PORT || 3000);
const root = path.resolve('apps/web/public');

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

http.createServer((req, res) => {
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
