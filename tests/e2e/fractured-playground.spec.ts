import { expect, test } from '@playwright/test'

test.describe('playground — fractured JSON', () => {
  test('Fractured mode uses pre whitespace so columns stay aligned', async ({ page }) => {
    await page.goto('/playground.html')
    await page.waitForSelector('.dv-viewer-wrap', { timeout: 15_000 })
    await page.getByRole('radio', { name: 'Fractured' }).click()
    const pre = page.locator('.dv-source-fractured pre.shiki')
    await expect(pre).toBeVisible({ timeout: 15_000 })
    await expect(pre).toHaveCSS('white-space', 'pre')
  })
})
