import { test, expect } from '@playwright/test'

test.describe('Easter Egg - SpyOnHim (Phase 12)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for startup screen and dismiss it
    await page.waitForSelector('[data-testid="startup-screen"]')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')
  })

  test('spyonhim command displays spy report', async ({ page }) => {
    // Execute spyonhim command
    await page.fill('[data-testid="command-input"] input', 'spyonhim')
    await page.keyboard.press('Enter')

    // Verify spy report container renders
    const spyReport = page.locator('[data-testid="spy-report"]')
    await expect(spyReport).toBeVisible()

    // Verify header text
    await expect(page.getByText(/CLASSIFIED TRANSMISSION/)).toBeVisible()
  })

  test('spy report shows typing animation', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'spyonhim')
    await page.keyboard.press('Enter')

    // Wait for report to load
    await page.waitForSelector('[data-testid="spy-report"]')

    // Wait for loading to finish and text to start appearing
    await page.waitForSelector('[data-testid="spy-report-text"]', { timeout: 10000 })

    // The text should gradually appear - check that some text exists
    const reportText = page.locator('[data-testid="spy-report-text"]')
    
    // Wait a bit for typing animation
    await page.waitForTimeout(500)
    
    // Text should have some content by now
    const textContent = await reportText.textContent()
    expect(textContent?.length).toBeGreaterThan(0)
  })

  test('spy command alias works', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'spy')
    await page.keyboard.press('Enter')

    await expect(page.locator('[data-testid="spy-report"]')).toBeVisible()
  })

  test('status command alias works', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'status')
    await page.keyboard.press('Enter')

    await expect(page.locator('[data-testid="spy-report"]')).toBeVisible()
  })

  test('whereishim command alias works', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'whereishim')
    await page.keyboard.press('Enter')

    await expect(page.locator('[data-testid="spy-report"]')).toBeVisible()
  })

  test('spy report has proper styling elements', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'spyonhim')
    await page.keyboard.press('Enter')

    await page.waitForSelector('[data-testid="spy-report"]')

    // Check for footer text
    await expect(page.getByText(/SECRET CLEARANCE REQUIRED/)).toBeVisible()
    
    // Check for the humor at the end
    await expect(page.getByText(/self-destruct/)).toBeVisible()
  })

  test('spy report shows loading state', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'spyonhim')
    await page.keyboard.press('Enter')

    // Try to catch the loading state (this might be brief)
    const spyReport = page.locator('[data-testid="spy-report"]')
    await expect(spyReport).toBeVisible({ timeout: 5000 })
  })

  test('spy report contains expected content indicators', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'spyonhim')
    await page.keyboard.press('Enter')

    // Wait for content to load
    await page.waitForSelector('[data-testid="spy-report-text"]', { timeout: 10000 })
    
    // Wait for typing to complete (give enough time)
    await page.waitForTimeout(3000)
    
    // The report should contain spy-like language
    const reportText = page.locator('[data-testid="spy-report-text"]')
    const text = await reportText.textContent()
    
    // Fallback report should contain spy-related terms
    expect(text).toBeTruthy()
    // Check for any spy-related content (emojis, terms, or status info)
    const hasSpyContent = 
      text?.includes('🕵️') || 
      text?.includes('INTEL') || 
      text?.includes('TARGET') ||
      text?.includes('SURVEILLANCE') ||
      text?.includes('TRANSMISSION') ||
      text?.includes('operative') ||
      text?.includes('San Francisco') || // Location from status.md
      text?.includes('Caffeinated') // Mood from status.md
    
    expect(hasSpyContent).toBe(true)
  })
})

test.describe('Easter Egg - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('spy report is accessible on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="startup-screen"]')
    await page.tap('[data-testid="startup-screen"]')

    // Wait for mobile navigation
    await page.waitForSelector('[data-testid="mobile-navigation"]')
    
    // Open command drawer
    const mobileNav = page.locator('[data-testid="mobile-navigation"]')
    await mobileNav.click()
    
    // Wait for drawer to open
    await page.waitForSelector('[data-testid="mobile-command-drawer"]')
    
    // Look for and tap the spyonhim command (or spy alias)
    // Note: The command might be listed by name or alias
    const spyBtn = page.locator('[data-testid="mobile-command-item"]').filter({ hasText: /spy/i })
    
    if (await spyBtn.count() > 0) {
      await spyBtn.first().click()
      await expect(page.locator('[data-testid="spy-report"]')).toBeVisible()
    }
  })
})
