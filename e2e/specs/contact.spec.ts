import { test, expect } from '@playwright/test'

test.describe('Contact Page (US8)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for startup screen and dismiss it
    await page.waitForSelector('[data-testid="startup-screen"]')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')
  })

  test('contact command displays contact information', async ({ page }) => {
    // Execute contact command
    await page.fill('[data-testid="command-input"] input', 'contact')
    await page.keyboard.press('Enter')

    // Verify contact view renders
    const contactView = page.locator('[data-testid="contact-view"]')
    await expect(contactView).toBeVisible()

    // Verify main heading
    await expect(page.getByText(/Get in Touch/)).toBeVisible()
  })

  test('contact links are present and clickable', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'contact')
    await page.keyboard.press('Enter')

    // Wait for contact view
    await page.waitForSelector('[data-testid="contact-view"]')

    // Verify contact links exist
    const contactLinks = page.locator('[data-testid="contact-link"]')
    await expect(contactLinks).toHaveCount(4) // email, github, linkedin, twitter

    // Check email link
    const emailLink = contactLinks.filter({ hasText: 'hello@girid.dev' })
    await expect(emailLink).toHaveAttribute('href', 'mailto:hello@girid.dev')

    // Check GitHub link
    const githubLink = contactLinks.filter({ hasText: 'github.com/girid' })
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/girid')
    await expect(githubLink).toHaveAttribute('target', '_blank')

    // Check LinkedIn link
    const linkedinLink = contactLinks.filter({ hasText: 'linkedin.com/in/girid' })
    await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/girid')
    await expect(linkedinLink).toHaveAttribute('target', '_blank')

    // Check Twitter link
    const twitterLink = contactLinks.filter({ hasText: '@girid_dev' })
    await expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/girid_dev')
    await expect(twitterLink).toHaveAttribute('target', '_blank')
  })

  test('external links have proper security attributes', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'contact')
    await page.keyboard.press('Enter')

    // Wait for contact view
    await page.waitForSelector('[data-testid="contact-view"]')

    // Check that external links have rel="noopener noreferrer"
    const externalLinks = page.locator('[data-testid="contact-link"][target="_blank"]')
    const count = await externalLinks.count()
    
    for (let i = 0; i < count; i++) {
      await expect(externalLinks.nth(i)).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('contact aliases work (connect, social, email)', async ({ page }) => {
    // Test 'connect' alias
    await page.fill('[data-testid="command-input"] input', 'connect')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="contact-view"]')).toBeVisible()

    // Clear and test 'social' alias
    await page.fill('[data-testid="command-input"] input', 'clear')
    await page.keyboard.press('Enter')
    await page.fill('[data-testid="command-input"] input', 'social')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="contact-view"]')).toBeVisible()

    // Clear and test 'email' alias
    await page.fill('[data-testid="command-input"] input', 'clear')
    await page.keyboard.press('Enter')
    await page.fill('[data-testid="command-input"] input', 'email')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="contact-view"]')).toBeVisible()
  })

  test('contact page has proper styling', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'contact')
    await page.keyboard.press('Enter')

    // Verify blockquote styling (response time message)
    const blockquote = page.locator('blockquote')
    await expect(blockquote).toBeVisible()
    await expect(blockquote).toContainText(/Response time/)
  })

  test('contact section headers have terminal styling', async ({ page }) => {
    await page.fill('[data-testid="command-input"] input', 'contact')
    await page.keyboard.press('Enter')

    // Verify section headers exist
    await expect(page.getByText('Connect With Me')).toBeVisible()
    await expect(page.getByText("Let's Chat")).toBeVisible()
  })
})

test.describe('Contact Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('contact page is accessible on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="startup-screen"]')
    await page.tap('[data-testid="startup-screen"]')

    // Wait for mobile navigation
    await page.waitForSelector('[data-testid="mobile-navigation"]')
    
    // Open command drawer and tap contact
    const mobileNav = page.locator('[data-testid="mobile-navigation"]')
    await mobileNav.click()
    
    // Wait for drawer to open
    await page.waitForSelector('[data-testid="mobile-command-drawer"]')
    
    // Look for and tap the contact command
    const contactBtn = page.locator('[data-testid="mobile-command-item"]').filter({ hasText: 'contact' })
    await contactBtn.click()

    // Verify contact view renders on mobile
    await expect(page.locator('[data-testid="contact-view"]')).toBeVisible()
    
    // Verify links are visible
    await expect(page.getByText(/Get in Touch/)).toBeVisible()
  })
})
