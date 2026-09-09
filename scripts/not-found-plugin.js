import fs from 'node:fs';
import path from 'node:path';

export function notFoundPage() {
  let root;
  return {
    name: 'nov-not-found',
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      return () =>
        server.middlewares.use((req, res, next) => {
          const pathname = new URL(req.url, 'http://localhost').pathname;
          if (
            pathname === '/' ||
            pathname === '/index.html' ||
            pathname.startsWith('/@') ||
            pathname.startsWith('/src/') ||
            pathname.startsWith('/node_modules/')
          )
            return next();
          const asset = path.resolve(root, 'public', '.' + pathname);
          if (
            asset.startsWith(path.join(root, 'public') + path.sep) &&
            fs.existsSync(asset) &&
            pathname !== '/404.html'
          )
            return next();
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('X-Robots-Tag', 'noindex');
          res.end(fs.readFileSync(path.join(root, 'public/404.html')));
        });
    },
  };
}
