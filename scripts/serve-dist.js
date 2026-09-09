import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { securityHeaders, cacheControl } from './headers.js';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const config = JSON.parse(
  fs.readFileSync(new URL('../.build/site.json', import.meta.url), 'utf8'),
);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
};
const port = Number(process.env.PORT || 4173);

http
  .createServer((req, res) => {
    Object.entries(securityHeaders).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    if (!config.indexable) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, 'http://localhost').pathname,
      );
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (pathname === '/index.html') {
      res
        .writeHead(308, {
          Location: '/' + new URL(req.url, 'http://localhost').search,
        })
        .end();
      return;
    }
    const target = path.resolve(
      root,
      '.' + (pathname === '/' ? '/index.html' : pathname),
    );
    const privatePath =
      pathname
        .split('/')
        .some((part) => part.startsWith('.') || part.startsWith('_')) ||
      pathname.includes('\\');
    const exists =
      target.startsWith(path.resolve(root) + path.sep) &&
      !privatePath &&
      fs.existsSync(target) &&
      fs.statSync(target).isFile();
    const missing = !exists || pathname === '/404.html';
    const file = missing ? path.join(root, '404.html') : target;
    res.statusCode = missing ? 404 : 200;
    if (missing) res.setHeader('X-Robots-Tag', 'noindex');
    res.setHeader(
      'Content-Type',
      mime[path.extname(file)] || 'application/octet-stream',
    );
    res.setHeader(
      'Cache-Control',
      missing ? 'no-store' : cacheControl(pathname),
    );
    res.setHeader('Content-Length', fs.statSync(file).size);
    if (req.method === 'HEAD') res.end();
    else fs.createReadStream(file).pipe(res);
  })
  .listen(port, '127.0.0.1', () =>
    console.log(`Production preview: http://127.0.0.1:${port}`),
  );
