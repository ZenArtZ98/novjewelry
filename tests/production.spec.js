import { test, expect } from '@playwright/test';
import { getSiteConfig, robots, sitemap } from '../scripts/site-config.js';

test.describe('built static site', () => {
  test.use({ baseURL: 'http://127.0.0.1:4173' });

  test('serves prerendered content and hydrates without browser or CSP errors', async ({
    page,
    request,
  }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('Серьги «Цветок» малиновые');
    expect(html).toContain('id="catalog"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('rel="icon"');
    expect(response.headers()['content-security-policy']).toContain(
      "script-src 'self'",
    );
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('/');
    await page
      .locator('#catalog')
      .getByRole('button', { name: 'птица', exact: true })
      .click();
    await expect(page.locator('#catalog article')).toHaveCount(2);
    await page.locator('#catalog article button').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });

  test('unknown paths and assets return a real 404 without redirecting to the home page', async ({
    request,
    page,
  }) => {
    for (const url of [
      '/not-a-page',
      '/catalog/missing/item',
      '/assets/missing.js',
      '/404.html',
      '/_headers',
      '/.env',
    ]) {
      const response = await request.get(url);
      expect(response.status(), url).toBe(404);
      expect(response.headers()['x-robots-tag']).toBe('noindex');
      expect(await response.text()).toContain('Здесь пока ничего не выросло');
    }
    const response = await page.goto('/catalog/missing/item');
    expect(response.status()).toBe(404);
    await expect(page.getByRole('heading')).toBeVisible();
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(255, 249, 241)',
    );
    await page.getByRole('link', { name: 'Вернуться на главную' }).click();
    await expect(page.locator('#catalog article')).toHaveCount(11);
  });

  test('preview is noindex and does not invent a sitemap domain', async ({
    request,
  }) => {
    const page = await request.get('/');
    expect(page.headers()['x-robots-tag']).toBe('noindex, nofollow');
    expect(await page.text()).toContain('content="noindex, nofollow"');
    const robotsFile = await request.get('/robots.txt');
    expect(robotsFile.status()).toBe(200);
    expect(await robotsFile.text()).toContain('Disallow: /');
    expect((await request.get('/sitemap.xml')).status()).toBe(404);
  });

  test('index.html redirects to the root and hashed assets have long-lived caching', async ({
    request,
  }) => {
    const redirect = await request.get('/index.html?utm_source=test', {
      maxRedirects: 0,
    });
    expect(redirect.status()).toBe(308);
    expect(redirect.headers().location).toBe('/?utm_source=test');
    const html = await (await request.get('/')).text();
    const script = html.match(/src="(\/assets\/[^" ]+\.js)"/)[1];
    const asset = await request.get(script);
    expect(asset.status()).toBe(200);
    expect(asset.headers()['cache-control']).toContain('immutable');
    expect((await request.head(script)).headers()['content-length']).toBe(
      asset.headers()['content-length'],
    );
    expect((await request.post('/')).status()).toBe(405);
  });

  test('the catalog is readable with JavaScript disabled', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    await expect(page.locator('#catalog article')).toHaveCount(11);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('noscript a')).toHaveText(
      'Связаться с НОВЬ во ВКонтакте',
    );
    await context.close();
  });
});

test('release configuration requires a domain and generates only real page URLs', () => {
  expect(() => getSiteConfig({}, { release: true })).toThrow('SITE_URL');
  for (const SITE_URL of [
    'http://nov.test',
    'https://nov.test/?x=1',
    'https://user@nov.test',
    'https://example.com',
  ]) {
    expect(() => getSiteConfig({ SITE_URL }, { release: true })).toThrow();
  }
  const config = getSiteConfig(
    { SITE_URL: 'https://nov.test/' },
    { release: true },
  );
  expect(config.origin).toBe('https://nov.test');
  expect(robots(config)).toBe(
    'User-agent: *\nAllow: /\n\nSitemap: https://nov.test/sitemap.xml\n',
  );
  expect(sitemap(config)).toContain('<loc>https://nov.test/</loc>');
  expect(sitemap(config)).not.toContain('#catalog');
  expect(sitemap(config)).not.toContain('404');
  const pagesConfig = getSiteConfig(
    { SITE_URL: 'https://zenartz98.github.io/novjewelry' },
    { release: true },
  );
  expect(pagesConfig.origin).toBe('https://zenartz98.github.io/novjewelry');
  expect(robots(pagesConfig)).toContain(
    'Sitemap: https://zenartz98.github.io/novjewelry/sitemap.xml',
  );
});
