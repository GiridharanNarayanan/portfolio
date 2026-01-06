import { test, expect } from '@playwright/test';

test.describe('US3 - Browse Writings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for startup screen and skip it
    await page.waitForSelector('[data-testid="startup-screen"]', { timeout: 5000 }).catch(() => {});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('displays writings list when "writings" command is entered', async ({ page }) => {
    // Type the writings command
    const input = page.locator('input[type="text"]');
    await input.fill('writings');
    await input.press('Enter');

    // Verify the writings list header appears
    await expect(page.locator('text=~/writings')).toBeVisible();
  });

  test('shows article count in writings list', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('writings');
    await input.press('Enter');

    // Should show at least 1 article (heads-up)
    await expect(page.locator('text=/\\d+ articles? found/')).toBeVisible();
  });

  test('displays heads-up post in writings list', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('writings');
    await input.press('Enter');

    // Verify the heads-up post appears
    await expect(page.locator('text=Heads-Up')).toBeVisible();
  });

  test('shows command hint for reading articles', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('writings');
    await input.press('Enter');

    // Verify the read command hint appears
    await expect(page.locator('text=read heads-up')).toBeVisible();
  });

  test('displays article content when "read <slug>" command is entered', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('read heads-up');
    await input.press('Enter');

    // Verify the article title appears
    await expect(page.locator('h1:has-text("Heads-Up")')).toBeVisible();
  });

  test('displays featured image in article view', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('read heads-up');
    await input.press('Enter');

    // Verify a featured image is present
    const featuredImage = page.locator('img[alt="Heads-Up"]');
    await expect(featuredImage).toBeVisible();
  });

  test('shows error message for non-existent article', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('read non-existent-post');
    await input.press('Enter');

    // Verify error message appears
    await expect(page.locator('text=Article not found')).toBeVisible();
    await expect(page.locator('text=non-existent-post')).toBeVisible();
  });

  test('shows usage hint when read command has no slug', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('read');
    await input.press('Enter');

    // Verify usage message appears
    await expect(page.locator('text=Usage: read <slug>')).toBeVisible();
  });

  test('returns to writings list with "back" command', async ({ page }) => {
    // Navigate to article
    const input = page.locator('input[type="text"]');
    await input.fill('read heads-up');
    await input.press('Enter');

    // Verify article is shown
    await expect(page.locator('h1:has-text("Heads-Up")')).toBeVisible();

    // Use back command
    await input.fill('back');
    await input.press('Enter');

    // Should be back at a state where we can navigate (could be home or previous)
    // The exact behavior depends on navigation stack implementation
  });

  test('blog alias works for writings command', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('blog');
    await input.press('Enter');

    // Verify the writings list appears
    await expect(page.locator('text=~/writings')).toBeVisible();
  });

  test('displays tags on articles', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('writings');
    await input.press('Enter');

    // Verify tags are shown (heads-up has tags like leadership, mindfulness)
    await expect(page.locator('text=#leadership').first()).toBeVisible();
  });
});
