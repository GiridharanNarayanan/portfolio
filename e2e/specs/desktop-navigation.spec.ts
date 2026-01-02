/**
 * E2E Tests: Desktop Command Navigation (US2)
 */

import { test, expect } from '@playwright/test'

test.describe('Desktop Command Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Dismiss startup screen
    await page.keyboard.press('Enter')
    // Wait for terminal to be visible
    await expect(page.getByRole('textbox', { name: 'Command input' })).toBeVisible()
  })

  test('help command shows available commands', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Command input' })
    
    await input.fill('help')
    await page.keyboard.press('Enter')
    
    // Should show "Available Commands:" heading
    await expect(page.getByText('Available Commands:')).toBeVisible()
    
    // Should show some commands
    await expect(page.getByText('help')).toBeVisible()
    await expect(page.getByText('clear')).toBeVisible()
    await expect(page.getByText('theme')).toBeVisible()
  })

  test('clear command clears output', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Command input' })
    
    // First run help to get some output
    await input.fill('help')
    await page.keyboard.press('Enter')
    await expect(page.getByText('Available Commands:')).toBeVisible()
    
    // Then clear
    await input.fill('clear')
    await page.keyboard.press('Enter')
    
    // Output should be cleared
    await expect(page.getByText('Available Commands:')).not.toBeVisible()
  })

  test('theme command toggles theme', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Command input' })
    
    // Check initial theme (should be dark - no light class)
    await expect(page.locator('html')).not.toHaveClass(/light/)
    
    // Toggle theme
    await input.fill('theme')
    await page.keyboard.press('Enter')
    
    // Should switch to light theme
    await expect(page.locator('html')).toHaveClass(/light/)
    
    // Toggle back
    await input.fill('theme')
    await page.keyboard.press('Enter')
    
    // Should be dark again
    await expect(page.locator('html')).not.toHaveClass(/light/)
  })

  test('arrow up navigates command history', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Command input' })
    
    // Enter some commands
    await input.fill('help')
    await page.keyboard.press('Enter')
    await input.fill('clear')
    await page.keyboard.press('Enter')
    
    // Press arrow up
    await page.keyboard.press('ArrowUp')
    
    // Should show last command
    await expect(input).toHaveValue('clear')
    
    // Press arrow up again
    await page.keyboard.press('ArrowUp')
    
    // Should show previous command
    await expect(input).toHaveValue('help')
  })

  test('invalid command shows error message', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Command input' })
    
    await input.fill('invalidcommand123')
    await page.keyboard.press('Enter')
    
    // Should show error
    await expect(page.getByText(/Command not found/)).toBeVisible()
  })

  test('sticky header is visible', async ({ page }) => {
    // Sticky header with terminal prompt should be visible
    await expect(page.getByText('portfolio')).toBeVisible()
    await expect(page.getByText('@')).toBeVisible()
    await expect(page.getByText('terminal')).toBeVisible()
  })

  test('command suggestions for typos', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Command input' })
    
    // Type a typo of "help"
    await input.fill('halp')
    await page.keyboard.press('Enter')
    
    // Should suggest "help"
    await expect(page.getByText(/Did you mean: help/)).toBeVisible()
  })
})
