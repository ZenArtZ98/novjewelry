import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, createServer, loadEnv } from 'vite';
import { getSiteConfig, robots, sitemap } from './site-config.js';
import { securityHeaders } from './headers.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = getSiteConfig(
  { ...loadEnv('production', root, ''), ...process.env },
  {
    release: process.argv.includes('--release'),
  },
);
await build({ root });

// Render the same React tree at build time. No SSR service is deployed.
const renderer = await createServer({
  root,
  mode: 'production',
  appType: 'custom',
  server: { middlewareMode: true },
});
let markup;
try {
  const { render } = await renderer.ssrLoadModule('/src/entry-server.jsx');
  markup = render();
} finally {
  await renderer.close();
}
const output = path.join(root, 'dist');
let html = await fs.readFile(path.join(output, 'index.html'), 'utf8');
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;');
const tags = [
  `<meta property="og:type" content="website">`,
  `<meta property="og:locale" content="ru_RU">`,
  `<meta property="og:site_name" content="${escape(config.name)}">`,
  `<meta property="og:title" content="${escape(config.title)}">`,
  `<meta property="og:description" content="${escape(config.description)}">`,
  `<meta name="twitter:card" content="summary_large_image">`,
  `<meta name="twitter:title" content="${escape(config.title)}">`,
  `<meta name="twitter:description" content="${escape(config.description)}">`,
];
if (config.origin) {
  tags.push(`<link rel="canonical" href="${config.origin}/">`);
  tags.push(`<meta property="og:url" content="${config.origin}/">`);
  tags.push(
    `<meta property="og:image" content="${config.origin}/assets/images/photo-meadow.webp">`,
    `<meta property="og:image:alt" content="Летнее поле — фон украшений НОВЬ">`,
    `<meta name="twitter:image" content="${config.origin}/assets/images/photo-meadow.webp">`,
  );
}
html = html
  .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
  .replace(
    'content="noindex, nofollow"',
    `content="${config.indexable ? 'index, follow' : 'noindex, nofollow'}"`,
  )
  .replace('</head>', `${tags.join('\n')}\n</head>`);
await fs.writeFile(path.join(output, 'index.html'), html);
// GitHub Pages project sites serve 404.html from the requested nested path.
// Prefix its links with Vite's base so assets and home navigation resolve there.
const base = (process.env.VITE_BASE || '/').replace(/\/?$/, '/');
for (const file of ['404.html', '404.css']) {
  const filePath = path.join(output, file);
  let content = await fs.readFile(filePath, 'utf8');
  content = content
    .replaceAll('href="/favicon.svg"', `href="${base}favicon.svg"`)
    .replaceAll('src="/favicon.svg"', `src="${base}favicon.svg"`)
    .replaceAll('href="/404.css"', `href="${base}404.css"`)
    .replaceAll('href="/"', `href="${base}"`)
    .replaceAll("url('/assets/", `url('${base}assets/`);
  await fs.writeFile(filePath, content);
}
await fs.writeFile(path.join(output, 'robots.txt'), robots(config));
const xml = sitemap(config);
if (xml) await fs.writeFile(path.join(output, 'sitemap.xml'), xml);

const headers = { ...securityHeaders };
if (!config.indexable) headers['X-Robots-Tag'] = 'noindex, nofollow';
await fs.writeFile(
  path.join(output, '_headers'),
  `/*\n${Object.entries(headers)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join('\n')}\n\n/404.html\n  X-Robots-Tag: noindex\n`,
);
// Generated alongside dist; never exposed as a public asset.
await fs.mkdir(path.join(root, '.build'), { recursive: true });
await fs.writeFile(
  path.join(root, '.build/site.json'),
  JSON.stringify({ indexable: config.indexable }),
);
await fs.writeFile(
  path.join(root, '.build/security-headers.conf'),
  Object.entries(headers)
    .map(([key, value]) => `add_header ${key} "${value}" always;`)
    .join('\n') + '\n',
);
console.log(
  config.indexable
    ? `Production: ${config.origin}/ — готовый HTML, robots.txt, sitemap.xml, canonical.`
    : 'Preview: индексация выключена. Для публикации: SITE_URL + npm run build:release.',
);
