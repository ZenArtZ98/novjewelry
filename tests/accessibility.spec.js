import { createRequire } from 'node:module';
import { test, expect } from '@playwright/test';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

for (const width of [390, 1440]) {
  test(`main page meets WCAG A/AA automated checks at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.addScriptTag({ path: axePath });
    const violations = [];
    for (const section of [
      '#hero',
      '#material',
      '#catalog',
      '#process',
      '#story',
      '#worn',
      '.faq__section',
      '#final',
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      violations.push(...(await scanAccessibility(page, section)));
    }
    await page.locator('#card-flw-red button').click();
    violations.push(...(await scanAccessibility(page, 'product dialog')));
    expect(violations).toEqual([]);
  });
}

async function scanAccessibility(page, location) {
  return page.evaluate(async (at) => {
    const results = await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    });
    return results.violations.map(({ id, nodes }) => ({
      at,
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({
        target,
        failureSummary,
      })),
    }));
  }, location);
}
