import { test, expect } from '@playwright/test';

// Mobile viewport settings
const mobileViewport = { width: 375, height: 667 }; // iPhone SE

test.describe('US6 - Mobile Touch Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(mobileViewport);
    await page.goto('/');
    
    // Wait for startup screen and skip it
    await page.waitForSelector('[data-testid="startup-screen"]', { timeout: 5000 }).catch(() => {});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('displays "Tap for commands" prompt on mobile', async ({ page }) => {
    await expect(page.locator('text=Tap for commands')).toBeVisible();
  });

  test('opens command drawer when tap area is clicked', async ({ page }) => {
    // Tap the command prompt area
    await page.click('text=Tap for commands');
    
    // Verify drawer opens
    await expect(page.locator('text=Available Commands')).toBeVisible();
  });

  test('displays available commands in drawer', async ({ page }) => {
    await page.click('text=Tap for commands');
    
    // Verify some commands are visible
    await expect(page.locator('text=help')).toBeVisible();
    await expect(page.locator('text=writings')).toBeVisible();
    await expect(page.locator('text=projects')).toBeVisible();
    await expect(page.locator('text=travel')).toBeVisible();
  });

  test('executes command when tapped in drawer', async ({ page }) => {
    // Open drawer
    await page.click('text=Tap for commands');
    
    // Tap on writings command
    await page.click('button:has-text("writings")');
    
    // Verify command executed (writings list should appear)
    await expect(page.locator('text=~/writings')).toBeVisible();
    
    // Verify drawer closed
    await expect(page.locator('text=Available Commands')).not.toBeVisible();
  });

  test('closes drawer when Cancel is tapped', async ({ page }) => {
    // Open drawer
    await page.click('text=Tap for commands');
    await expect(page.locator('text=Available Commands')).toBeVisible();
    
    // Tap Cancel
    await page.click('text=Cancel');
    
    // Verify drawer closed
    await expect(page.locator('text=Available Commands')).not.toBeVisible();
  });

  test('closes drawer when backdrop is tapped', async ({ page }) => {
    // Open drawer
    await page.click('text=Tap for commands');
    await expect(page.locator('text=Available Commands')).toBeVisible();
    
    // Tap backdrop (the semi-transparent overlay)
    await page.click('.bg-black\\/50');
    
    // Verify drawer closed
    await expect(page.locator('text=Available Commands')).not.toBeVisible();
  });

  test('command buttons have minimum 44px touch targets', async ({ page }) => {
    // Open drawer
    await page.click('text=Tap for commands');
    
    // Check command items have minimum height
    const commandItems = page.locator('.mobile-command-item');
    const count = await commandItems.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const item = commandItems.nth(i);
      const box = await item.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('no keyboard command input visible on mobile', async ({ page }) => {
    // The desktop command input should not be visible
    const desktopInput = page.locator('input[type="text"]');
    await expect(desktopInput).not.toBeVisible();
  });

  test('shows command descriptions in drawer', async ({ page }) => {
    await page.click('text=Tap for commands');
    
    // Verify descriptions are shown
    await expect(page.locator('text=Show available commands')).toBeVisible();
  });

  test('help command works via drawer', async ({ page }) => {
    // Open drawer and tap help
    await page.click('text=Tap for commands');
    await page.click('button:has-text("help")');
    
    // Verify help output appears
    await expect(page.locator('text=Available Commands:')).toBeVisible();
  });

  test('theme command works via drawer', async ({ page }) => {
    // Get initial body class
    const body = page.locator('body');
    const initialClass = await body.getAttribute('class');
    
    // Open drawer and tap theme
    await page.click('text=Tap for commands');
    await page.click('button:has-text("theme")');
    
    // Verify theme changed (body class should change)
    const newClass = await body.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('drawer is scrollable with many commands', async ({ page }) => {
    await page.click('text=Tap for commands');
    
    // The drawer content area should be scrollable
    const drawer = page.locator('[role="dialog"]');
    const scrollArea = drawer.locator('.overflow-y-auto');
    await expect(scrollArea).toBeVisible();
  });
});

// Test on larger mobile viewport (tablet-ish but still mobile breakpoint)
test.describe('US6 - Mobile Navigation on larger mobile', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport just under the mobile breakpoint (640px)
    await page.setViewportSize({ width: 600, height: 900 });
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="startup-screen"]', { timeout: 5000 }).catch(() => {});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('still shows mobile navigation under 640px', async ({ page }) => {
    await expect(page.locator('text=Tap for commands')).toBeVisible();
  });
});

// Test desktop should NOT show mobile navigation
test.describe('US6 - Desktop should not show mobile navigation', () => {
  test('shows keyboard input on desktop viewport', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="startup-screen"]', { timeout: 5000 }).catch(() => {});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Should show text input, not mobile navigation
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('text=Tap for commands')).not.toBeVisible();
  });
});
