/**
 * E2E Tests: Startup Screen (US1)
 */

import { test, expect } from '@playwright/test'

test.describe('Startup Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders ASCII art on load', async ({ page }) => {
    // Check for the ASCII art container
    const asciiArt = page.getByLabel('GIRID')
    await expect(asciiArt).toBeVisible()
    
    // Verify it contains the ASCII characters
    const content = await asciiArt.textContent()
    expect(content).toContain('██')
  })

  test('displays name and job title subtext', async ({ page }) => {
    await expect(page.getByText('Giri Dayanandan')).toBeVisible()
    await expect(page.getByText('Software Engineer')).toBeVisible()
  })

  test('keypress triggers transition', async ({ page }) => {
    // Startup screen should be visible
    const banner = page.getByRole('banner', { name: 'Welcome screen' })
    await expect(banner).toBeVisible()
    
    // Press any key
    await page.keyboard.press('Enter')
    
    // Startup screen should disappear
    await expect(banner).not.toBeVisible()
  })

  test('tap triggers transition on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const banner = page.getByRole('banner', { name: 'Welcome screen' })
    await expect(banner).toBeVisible()
    
    // Tap the screen
    await page.click('body')
    
    // Startup screen should disappear
    await expect(banner).not.toBeVisible()
  })

  test('idle prompt appears after 3 seconds', async ({ page }) => {
    const prompt = page.getByText(/Press any key to continue/i)
    
    // Initially should have opacity-0 class (hidden)
    const promptContainer = prompt.locator('..')
    await expect(promptContainer).toHaveClass(/opacity-0/)
    
    // Wait for 3 seconds
    await page.waitForTimeout(3100)
    
    // Should now be visible
    await expect(promptContainer).toHaveClass(/opacity-100/)
  })

  test('has terminal-styled border decoration', async ({ page }) => {
    // Check for box-drawing characters in the border
    const pageContent = await page.content()
    expect(pageContent).toContain('╔')
    expect(pageContent).toContain('╝')
    expect(pageContent).toContain('═')
  })
})
