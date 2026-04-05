import { expect, test } from '@playwright/test'

test.describe('docs — smoke', () => {
  test('home renders hero', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1').first()).toContainText('Data Visor')
  })

  test('home DataVisor applies Shiki colors (single-line JSON)', async ({ page }) => {
    await page.goto('/')
    const shiki = page.locator('.dv-viewer-wrap .dv-node-value__shiki')
    await expect(shiki.first()).toBeVisible({ timeout: 15_000 })
    await expect(shiki.locator('span[style*="color"]').first()).toBeVisible()
  })

  test('vue getting started loads', async ({ page }) => {
    await page.goto('/vue/getting-started.html')
    await expect(page.locator('main')).toContainText('DataVisor')
  })

  test('web extension overview loads', async ({ page }) => {
    await page.goto('/web-ext/index.html')
    await expect(page.locator('main')).toContainText('data-visor-web-ext')
  })

  test('playground shows a viewer', async ({ page }) => {
    await page.goto('/playground.html')
    await page.waitForSelector('.dv-viewer-wrap', { timeout: 15_000 })
    await expect(page.locator('.dv-viewer-wrap').first()).toBeVisible()
  })
})
