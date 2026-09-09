export const site = {
  name: 'НОВЬ',
  title: 'НОВЬ — украшения из переработанного пластика',
  description:
    'НОВЬ — украшения и небольшие объекты из переработанного пластика. Авторская мастерская Ярославы. Доставка по всей России.',
};

export function getSiteConfig(env, { release = false } = {}) {
  const value = env.SITE_URL?.trim();
  if (release && !value) {
    throw new Error(
      'Для production-сборки задайте SITE_URL в .env.local или окружении.',
    );
  }
  let origin = null;
  if (value) {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.port ||
      ['localhost', '127.0.0.1', 'example.com'].includes(url.hostname) ||
      url.hostname.endsWith('.invalid')
    ) {
      throw new Error(
        'SITE_URL должен содержать реальный HTTPS-домен с необязательным путём, без порта и параметров.',
      );
    }
    origin = url.origin + url.pathname.replace(/\/$/, '');
  }
  return { ...site, origin, indexable: release };
}

export function robots(config) {
  return config.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${config.origin}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
}

export function sitemap(config) {
  if (!config.indexable || !config.origin) return null;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${config.origin}/</loc></url>\n</urlset>\n`;
}
