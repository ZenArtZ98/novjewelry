import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const approvedLayouts = JSON.parse(
  fs.readFileSync(
    new URL('./fixtures/approved-layouts.json', import.meta.url),
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
    ['кокошник', 1],
    ['матрёшка', 1],
    ['краса', 1],
    ['всё', 11],
  ]) {
    await catalog.getByRole('button', { name, exact: true }).click();
    await expect(catalog.locator('article')).toHaveCount(count);
  }
});

test('keyboard visitors can skip the hero and reach the catalog', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Перейти к каталогу' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#catalog')).toBeInViewport();
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

test('kokoshnik and matryoshka are separate earrings and Krasa keeps its cable', async ({
  page,
}) => {
  await page.goto('/');
  const catalog = page.locator('#catalog');
  for (const [filter, id, title] of [
    ['кокошник', 'kks-red', 'Серьги «Кокошник» малиновые'],
    ['матрёшка', 'mtr-red', 'Серьги «Матрёшка» малиновые'],
  ]) {
    await catalog.getByRole('button', { name: filter, exact: true }).click();
    await expect(catalog.locator('article')).toHaveCount(1);
    await page.locator(`#card-${id} button`).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading')).toHaveText(title);
    await expect(dialog.locator('.productmodal__kind')).toHaveText('СЕРЬГИ');
    await expect(dialog.locator('dl')).toContainText('Фурнитура');
    await expect(dialog.locator('dl')).toContainText('нержавеющая сталь');
    await expect(dialog).not.toContainText('карабин');
    await page.keyboard.press('Escape');
  }
  await catalog.getByRole('button', { name: 'краса', exact: true }).click();
  await page.locator('#card-krs-mnt button').click();
  await expect(page.getByRole('dialog').locator('dl')).toContainText(
    'стальной тросик в бирюзовой оплётке',
  );
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
  await page
    .getByRole('button', { name: 'Можно ли свой дизайн?', exact: true })
    .click();
  await expect(page.locator('.faq__answer')).toContainText(
    'подберём форму и цвет',
  );
  await page
    .getByRole('button', {
      name: 'Можно ли сдать ваше изделие на переработку?',
      exact: true,
    })
    .click();
  await expect(page.locator('.faq__answer')).toContainText(
    'снова сделаем из него украшение',
  );
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

test('the photo ribbon loads its images when visitors reach it', async ({
  page,
}) => {
  await page.goto('/');
  const photos = page.locator('.worn__photo img');
  await expect(photos).toHaveCount(15);
  expect(
    await photos.evaluateAll(
      (images) =>
        images.filter((image) => image.complete && image.naturalWidth > 0)
          .length,
    ),
  ).toBe(0);
  await page.locator('#worn').scrollIntoViewIfNeeded();
  await expect
    .poll(() => photos.first().evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);
});

test.describe('mobile layout and navigation', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test('catalog cards stay separated in every category on narrow screens', async ({
    page,
  }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const catalog = page.locator('#catalog');
    for (const width of [320, 360, 390, 430, 760]) {
      await page.setViewportSize({ width, height: 844 });
      for (const name of [
        'всё',
        'цветок',
        'птица',
        'конёк',
        'кокошник',
        'матрёшка',
        'краса',
      ]) {
        await catalog.getByRole('button', { name, exact: true }).tap();
        const cards = await catalog.locator('article').evaluateAll((elements) =>
          elements.map((el) => {
            const { left, right, top, bottom } = el.getBoundingClientRect();
            return { left, right, top, bottom };
          }),
        );
        for (let i = 0; i < cards.length; i++) {
          for (let j = i + 1; j < cards.length; j++) {
            const a = cards[i];
            const b = cards[j];
            const gap = Math.max(
              b.left - a.right,
              a.left - b.right,
              b.top - a.bottom,
              a.top - b.bottom,
            );
            expect(
              gap,
              `${width}px, ${name}: cards ${i} and ${j}`,
            ).toBeGreaterThanOrEqual(16);
          }
        }
      }
    }
  });

  test('menu supports section links, dismissal and switching to desktop', async ({
    page,
  }) => {
    await page.goto('/');
    const toggle = page.locator('.header__menu-toggle');
    const nav = page.getByRole('navigation', { name: 'Основная навигация' });
    await expect(nav).toBeHidden();
    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link')).toHaveCount(5);
    await nav.getByRole('link', { name: 'Материал', exact: true }).tap();
    await expect(nav).toBeHidden();
    await expect(page.locator('.material__heading')).toBeInViewport();
    await toggle.tap();
    await page.touchscreen.tap(20, 800);
    await expect(nav).toBeHidden();
    await toggle.tap();
    await page.keyboard.press('Escape');
    await expect(nav).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.tap();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(toggle).toBeHidden();
    await expect(nav).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(nav).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

for (const { width, height, sections } of approvedLayouts) {
  test(`layout and catalog remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    if (width <= 760) {
      for (const selector of [
        '.pageeffects__progress',
        '.pageeffects__cursor',
        '.pageeffects__seeds',
        '.process__side-label',
      ]) {
        await expect(page.locator(selector)).toBeHidden();
      }
      const bounds = await page.evaluate(() =>
        [
          '.material__heading',
          '.material__description',
          '.material__sample',
          '.material__label',
          '.material__swatches',
          '.material__note',
        ].map((selector) => {
          const rect = document.querySelector(selector).getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom };
        }),
      );
      for (let i = 1; i < bounds.length; i++) {
        expect(bounds[i].top).toBeGreaterThanOrEqual(bounds[i - 1].bottom);
      }
    }
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
      expect(Math.abs(current[i].width - sections[i].width)).toBeLessThan(1);
      // Text wrapping differs slightly between font formats and operating systems.
      expect(Math.abs(current[i].height - sections[i].height)).toBeLessThan(
        Math.max(24, sections[i].height * 0.03),
      );
      expect(Math.abs(current[i].y - sections[i].y)).toBeLessThan(
        Math.max(36, sections[i].y * 0.015),
      );
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
