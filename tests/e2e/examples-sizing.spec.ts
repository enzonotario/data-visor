import { expect, test } from '@playwright/test'

test.describe('docs examples — sizing', () => {
  test('min-height demo: wrap is 300px tall after collapse (correct section)', async ({ page }) => {
    await page.goto('/vue/examples.html#examples-live-sizing')
    await page.waitForSelector('.dv-viewer-wrap')

    const sizingBlock = page
      .locator('div.flex.flex-col.gap-4')
      .filter({ hasText: 'Max Height 200px' })
      .first()
    const minWrap = sizingBlock.locator('.dv-viewer-wrap').nth(2)

    await expect(minWrap).toBeVisible()
    await expect(minWrap).toHaveCSS('min-height', '300px')

    await minWrap.locator('button[title="Collapse all (CTRL+[ or CTRL+SHIFT+-)"]').click()
    await page.waitForTimeout(300)

    const box = await minWrap.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(299)
    expect(box?.height).toBeLessThanOrEqual(310)
  })

  test('min+max-height demo: wrap reaches max after expand all', async ({ page }) => {
    await page.goto('/vue/examples.html#examples-live-sizing')
    await page.waitForSelector('.dv-viewer-wrap')

    const sizingBlock = page
      .locator('div.flex.flex-col.gap-4')
      .filter({ hasText: 'Max Height 200px' })
      .first()
    const minWrap = sizingBlock.locator('.dv-viewer-wrap').nth(2)

    await expect(minWrap).toHaveCSS('max-height', '500px')

    await minWrap.locator('button[title="Expand all (CTRL+] or CTRL+SHIFT++)"]').click()
    await page.waitForTimeout(400)

    const box = await minWrap.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(495)
    expect(box?.height).toBeLessThanOrEqual(512)
  })

  test('Initial Depth live demo viewers have no min-height prop', async ({ page }) => {
    await page.goto('/vue/examples.html#examples-live-depth')
    await page.waitForSelector('.dv-viewer-wrap')

    const depthBlock = page
      .locator('div.flex.flex-col.gap-4')
      .filter({ hasText: 'Depth 1:' })
      .first()
    const firstWrap = depthBlock.locator('> .dv-viewer-wrap').first()
    const style = await firstWrap.getAttribute('style')
    expect(style ?? '').not.toMatch(/min-height/i)
  })
})
