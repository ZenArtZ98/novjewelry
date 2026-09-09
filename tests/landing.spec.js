import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const originalLayouts = JSON.parse(
  fs.readFileSync(
    new URL('./fixtures/original-layouts.json', import.meta.url),
    'utf8',
  ),
);

test('loads the catalog, original media and fonts without runtime or resource errors', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/');
  await expect(page.locator('#catalog article')).toHaveCount(11);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Носи то, что',
  );
  expect(
    await page.evaluate(
      () =>
        document.fonts.check('16px Montserrat') &&
        document.fonts.check('40px Belarus'),
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test('filters every category and restores all eleven products', async ({
  page,
}) => {
  await page.goto('/');
  const catalog = page.locator('#catalog');
  for (const [name, count] of [
    ['цветок', 4],
    ['птица', 2],
    ['конёк', 2],
    ['кокошник', 2],
    ['краса', 1],
    ['всё', 11],
  ]) {
    await catalog.getByRole('button', { name, exact: true }).click();
    await expect(catalog.locator('article')).toHaveCount(count);
  }
});

test('product dialog supports details, focus trapping, Escape and focus restoration', async ({
  page,
}) => {
  await page.goto('/');
  const product = page.locator('#card-flw-red button');
  await product.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Серьги «Цветок» малиновые');
  await expect(dialog).toContainText('FLW-RED-ER-01');
  await expect(
    dialog.getByRole('link', { name: 'Написать в сообщения сообщества' }),
  ).toHaveAttribute('href', 'https://vk.ru/novi_jewelry');
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(product).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('hero cards open the matching product and the close button works', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  // These cards float continuously; a real pointer click does not wait for them to stop.
  const card = page.locator('#nv-hero-cards button').first();
  await expect(card).toBeVisible();
  const box = await card.boundingBox();
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.5);
  await expect(page.getByRole('dialog')).toContainText(
    'Подвеска «Цветок» розовый',
  );
  await page.getByRole('button', { name: 'Закрыть окно изделия' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('material swatches and FAQ change content', async ({ page }) => {
  await page.goto('/');
  await page
    .locator('#material')
    .getByRole('button', { name: 'малина', exact: true })
    .click();
  await expect(page.locator('.material__note')).toContainText(
    'В малиновом ПНД',
  );
  await page
    .locator('#material')
    .getByRole('button', { name: 'розовый', exact: true })
    .click();
  await expect(page.locator('.material__note')).toContainText('Розовая партия');
  const question = page.getByRole('button', {
    name: 'Как ухаживать?',
    exact: true,
  });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.faq__answer')).toContainText(
    'Тёплая вода и мягкая тряпка',
  );
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'false');
});

test('photo ribbon scrolls horizontally and changes its perspective', async ({
  page,
}) => {
  await page.goto('/');
  const ribbon = page.locator('#nv-worn-scroll');
  await ribbon.scrollIntoViewIfNeeded();
  await ribbon.hover();
  await page.mouse.wheel(0, 380);
  await expect
    .poll(() => ribbon.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await expect(page.locator('[data-worn]').first()).toHaveCSS('opacity', '0.7');
});

for (const { width, height, sections } of originalLayouts) {
  test(`layout and catalog remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    const current = await page.locator('section').evaluateAll((elements) =>
      elements.map((el) => {
        const bounds = el.getBoundingClientRect();
        return {
          id: el.id,
          width: bounds.width,
          height: bounds.height,
          y: bounds.y,
        };
      }),
    );
    for (let i = 0; i < sections.length; i++) {
      expect(current[i].id).toBe(sections[i].id);
      for (const key of ['width', 'height', 'y'])
        expect(Math.abs(current[i][key] - sections[i][key])).toBeLessThan(1);
    }
    await expect(page.locator('#nv-hero-cards')).toBeVisible({
      visible: width > 760,
    });
    await page
      .locator('#catalog')
      .getByRole('button', { name: 'птица', exact: true })
      .click();
    await page.locator('#catalog article button').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Закрыть окно изделия' }),
    ).toBeInViewport();
  });
}

test('reduced motion keeps the content visible and stops decorative animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero__line-first')).toHaveCSS('opacity', '1');
  await expect(page.locator('#nv-hero-bg')).toHaveCSS('animation-name', 'none');
  await page.mouse.move(300, 200);
  await expect(page.locator('#nv-seeds span')).toHaveCount(0);
});
