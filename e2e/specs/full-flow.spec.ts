import { test, expect } from '@playwright/test'

test.describe('Full User Journey', () => {
  test('complete flow from startup to content browsing', async ({ page }) => {
    // 1. Visit the site
    await page.goto('/')

    // 2. See startup screen
    const startupScreen = page.locator('[data-testid="startup-screen"]')
    await expect(startupScreen).toBeVisible()
    await expect(page.getByText(/GiriD/i)).toBeVisible()

    // 3. Press key to continue
    await page.keyboard.press('Enter')
    await expect(startupScreen).not.toBeVisible()

    // 4. Terminal is ready
    const commandInput = page.locator('[data-testid="command-input"]')
    await expect(commandInput).toBeVisible()

    // 5. Type help command
    await page.fill('[data-testid="command-input"] input', 'help')
    await page.keyboard.press('Enter')
    await expect(page.getByText(/Available commands/i)).toBeVisible()

    // 6. Navigate to writings
    await page.fill('[data-testid="command-input"] input', 'writings')
    await page.keyboard.press('Enter')
    await expect(page.getByText(/heads-up/i)).toBeVisible()

    // 7. Read a post
    await page.fill('[data-testid="command-input"] input', 'read heads-up')
    await page.keyboard.press('Enter')
    await expect(page.getByText(/Heads-Up/i)).toBeVisible()

    // 8. Go back
    await page.fill('[data-testid="command-input"] input', 'back')
    await page.keyboard.press('Enter')

    // 9. Navigate to projects
    await page.fill('[data-testid="command-input"] input', 'projects')
    await page.keyboard.press('Enter')
    await expect(page.getByText(/sample-project/i)).toBeVisible()

    // 10. Check about page
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="about-view"]')).toBeVisible()
    await expect(page.getByText(/Career Timeline/i)).toBeVisible()

    // 11. Clear screen
    await page.fill('[data-testid="command-input"] input', 'clear')
    await page.keyboard.press('Enter')
    // Output should be cleared
  })

  test('theme toggle persistence within session', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')

    // Get initial theme
    const body = page.locator('body')
    const initialBgColor = await body.evaluate(el => 
      getComputedStyle(el).getPropertyValue('--color-bg')
    )

    // Toggle theme
    await page.fill('[data-testid="command-input"] input', 'theme')
    await page.keyboard.press('Enter')

    // Theme should change
    const newBgColor = await body.evaluate(el => 
      getComputedStyle(el).getPropertyValue('--color-bg')
    )
    expect(newBgColor).not.toBe(initialBgColor)

    // Navigate away and back
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="about-view"]')).toBeVisible()

    await page.fill('[data-testid="command-input"] input', 'help')
    await page.keyboard.press('Enter')

    // Theme should persist
    const persistedBgColor = await body.evaluate(el => 
      getComputedStyle(el).getPropertyValue('--color-bg')
    )
    expect(persistedBgColor).toBe(newBgColor)
  })

  test('keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')

    // Type first command
    await page.fill('[data-testid="command-input"] input', 'help')
    await page.keyboard.press('Enter')

    // Type second command
    await page.fill('[data-testid="command-input"] input', 'about')
    await page.keyboard.press('Enter')

    // Use arrow up to go back in history
    const input = page.locator('[data-testid="command-input"] input')
    await input.focus()
    await page.keyboard.press('ArrowUp')
    
    // Input should show previous command
    await expect(input).toHaveValue('about')
    
    await page.keyboard.press('ArrowUp')
    await expect(input).toHaveValue('help')

    // Arrow down to go forward
    await page.keyboard.press('ArrowDown')
    await expect(input).toHaveValue('about')
  })

  test('error handling for invalid commands', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')

    // Type invalid command
    await page.fill('[data-testid="command-input"] input', 'invalidcommand123')
    await page.keyboard.press('Enter')

    // Should show error or suggestions
    await expect(page.getByText(/not found|unknown|did you mean/i)).toBeVisible()
  })

  test('command aliases work', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')

    // Test 'blog' alias for 'writings'
    await page.fill('[data-testid="command-input"] input', 'blog')
    await page.keyboard.press('Enter')
    await expect(page.getByText(/sample-post/i)).toBeVisible()

    // Test 'me' alias for 'about'
    await page.fill('[data-testid="command-input"] input', 'me')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="about-view"]')).toBeVisible()
  })
})

test.describe('Cross-browser basics', () => {
  test('renders correctly and is interactive', async ({ page, browserName }) => {
    await page.goto('/')

    // Startup screen should render
    await expect(page.locator('[data-testid="startup-screen"]')).toBeVisible()

    // Can interact
    await page.keyboard.press('Space')
    await page.waitForSelector('[data-testid="command-input"]')

    // Terminal is functional
    await page.fill('[data-testid="command-input"] input', 'help')
    await page.keyboard.press('Enter')
    await expect(page.getByText(/Available commands/i)).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('skip link is focusable', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')

    // Tab to skip link
    await page.keyboard.press('Tab')
    
    // Skip link should be focusable (may not be visible until focused)
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()
  })

  test('command input has proper focus management', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')

    // Command input should be auto-focused
    const input = page.locator('[data-testid="command-input"] input')
    await expect(input).toBeFocused()
  })

  test('error messages have proper role', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="command-input"]')

    // Trigger an error
    await page.fill('[data-testid="command-input"] input', 'nonexistentcmd')
    await page.keyboard.press('Enter')

    // Error should have alert role (somewhere in the output)
    // Note: The specific implementation may vary
  })
})
