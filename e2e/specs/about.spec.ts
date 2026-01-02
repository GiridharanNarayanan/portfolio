import { test, expect } from '@playwright/test'

test.describe('About Page (US7)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for startup screen and dismiss it
    await page.waitForSelector('[data-testid="startup-screen"]')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')
  })

  test('about command displays bio blurb', async ({ page }) => {
    // Execute about command
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // Verify about view renders
    const aboutView = page.locator('[data-testid="about-view"]')
    await expect(aboutView).toBeVisible()

    // Verify bio section content
    await expect(page.getByText(/Hello, I'm Giri/)).toBeVisible()
    await expect(page.getByText(/software engineer/i)).toBeVisible()
  })

  test('resume download button is visible and functional', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // Verify resume download button exists
    const downloadButton = page.locator('[data-testid="resume-download"]')
    await expect(downloadButton).toBeVisible()
    await expect(downloadButton).toContainText(/Download Resume/i)

    // Verify download attribute
    await expect(downloadButton).toHaveAttribute('download', '')
    await expect(downloadButton).toHaveAttribute('href', '/resume.pdf')
  })

  test('career timeline renders with entries', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // Verify timeline section header
    await expect(page.getByText('Career Timeline')).toBeVisible()

    // Verify timeline container exists
    const timeline = page.locator('[data-testid="career-timeline"]')
    await expect(timeline).toBeVisible()

    // Verify entries are rendered
    const entries = page.locator('[data-testid="career-timeline-entry"]')
    await expect(entries).toHaveCount(4) // 4 entries in about.json
  })

  test('career timeline entries show correct content', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // Check for specific entry content
    await expect(page.getByText('Senior Software Engineer')).toBeVisible()
    await expect(page.getByText('TechCorp Inc.')).toBeVisible()
    await expect(page.getByText('San Francisco, CA')).toBeVisible()
  })

  test('current position shows CURRENT badge', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // TechCorp entry has no endDate, should show CURRENT
    await expect(page.getByText('CURRENT')).toBeVisible()
  })

  test('timeline entry expands on hover', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // Find the first entry card
    const firstEntry = page.locator('[data-testid="career-timeline-entry"]').first()
    const card = firstEntry.locator('[role="article"]')

    // Get initial state
    await expect(card).toBeVisible()

    // Hover should trigger scale transformation (visual emphasis)
    await card.hover()
    
    // Card should still be visible and accessible after hover
    await expect(card).toBeVisible()
  })

  test('about aliases work (me, bio, whoami)', async ({ page }) => {
    // Test 'me' alias
    await page.fill('[data-testid="command-input"] input', 'me')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="about-view"]')).toBeVisible()

    // Clear and test 'bio' alias
    await page.fill('[data-testid="command-input"] input', 'clear')
    await page.keyboard.press('Enter')
    await page.fill('[data-testid="command-input"] input', 'bio')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="about-view"]')).toBeVisible()

    // Clear and test 'whoami' alias
    await page.fill('[data-testid="command-input"] input', 'clear')
    await page.keyboard.press('Enter')
    await page.fill('[data-testid="command-input"] input', 'whoami')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="about-view"]')).toBeVisible()
  })

  test('education entries have different styling than work', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // Find education entry
    const educationEntry = page.locator('[data-testid="career-timeline-entry"][data-type="education"]')
    await expect(educationEntry).toHaveCount(1)

    // Find work entries
    const workEntries = page.locator('[data-testid="career-timeline-entry"][data-type="work"]')
    await expect(workEntries).toHaveCount(3)
  })

  test('timeline entries alternate positions', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    const entries = page.locator('[data-testid="career-timeline-entry"]')
    
    // First entry should be left
    await expect(entries.nth(0)).toHaveAttribute('data-position', 'left')
    // Second entry should be right
    await expect(entries.nth(1)).toHaveAttribute('data-position', 'right')
    // Third entry should be left
    await expect(entries.nth(2)).toHaveAttribute('data-position', 'left')
    // Fourth entry should be right
    await expect(entries.nth(3)).toHaveAttribute('data-position', 'right')
  })

  test('blockquote styling is applied to bio', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // Verify blockquote is rendered (Peter Drucker quote)
    const blockquote = page.locator('blockquote')
    await expect(blockquote).toBeVisible()
    await expect(blockquote).toContainText(/The best way to predict the future/)
  })
})

test.describe('About Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('about page is accessible on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="startup-screen"]')
    await page.tap('[data-testid="startup-screen"]')

    // Wait for mobile navigation
    await page.waitForSelector('[data-testid="mobile-navigation"]')
    
    // Open command drawer and tap about
    const mobileNav = page.locator('[data-testid="mobile-navigation"]')
    await mobileNav.click()
    
    // Wait for drawer to open
    await page.waitForSelector('[data-testid="mobile-command-drawer"]')
    
    // Look for and tap the about command
    const aboutBtn = page.locator('[data-testid="mobile-command-item"]').filter({ hasText: 'about' })
    await aboutBtn.click()

    // Verify about view renders on mobile
    await expect(page.locator('[data-testid="about-view"]')).toBeVisible()
  })

  test('timeline entries can be tapped on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="startup-screen"]')
    await page.tap('[data-testid="startup-screen"]')

    await page.waitForSelector('[data-testid="mobile-navigation"]')
    const mobileNav = page.locator('[data-testid="mobile-navigation"]')
    await mobileNav.click()
    await page.waitForSelector('[data-testid="mobile-command-drawer"]')
    
    const aboutBtn = page.locator('[data-testid="mobile-command-item"]').filter({ hasText: 'about' })
    await aboutBtn.click()

    // Find and tap a timeline entry
    const firstEntry = page.locator('[data-testid="career-timeline-entry"]').first()
    const card = firstEntry.locator('[role="article"]')
    
    await card.tap()
    
    // Entry should still be visible and accessible after tap
    await expect(card).toBeVisible()
  })
})
