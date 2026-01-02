import { test, expect } from '@playwright/test';

test.describe('US5 - Browse Travel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for startup screen and skip it
    await page.waitForSelector('[data-testid="startup-screen"]', { timeout: 5000 }).catch(() => {});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('displays travel list when "travel" command is entered', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('travel');
    await input.press('Enter');

    // Verify the travel list header appears
    await expect(page.locator('text=~/travel')).toBeVisible();
  });

  test('shows adventure count in travel list', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('travel');
    await input.press('Enter');

    // Should show at least 1 adventure (the sample trip)
    await expect(page.locator('text=/\\d+ adventures? found/')).toBeVisible();
  });

  test('displays sample trip in travel list', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('travel');
    await input.press('Enter');

    // Verify the sample trip appears
    await expect(page.locator('text=Tokyo Tech Scene Adventure')).toBeVisible();
  });

  test('shows location on travel cards', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('travel');
    await input.press('Enter');

    // Verify location is shown
    await expect(page.locator('text=Tokyo, Japan')).toBeVisible();
  });

  test('displays travel story when "explore <slug>" command is entered', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('explore sample-trip');
    await input.press('Enter');

    // Verify the story title appears
    await expect(page.locator('h1:has-text("Tokyo Tech Scene Adventure")')).toBeVisible();
  });

  test('displays featured image in travel story', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('explore sample-trip');
    await input.press('Enter');

    // Verify a featured image is present
    const featuredImage = page.locator('img[alt="Tokyo Tech Scene Adventure"]');
    await expect(featuredImage).toBeVisible();
  });

  test('displays gallery images in travel story', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('explore sample-trip');
    await input.press('Enter');

    // Verify gallery section exists
    await expect(page.locator('text=Gallery')).toBeVisible();

    // Verify gallery images are loaded
    const galleryImages = page.locator('img[alt^="Gallery image"]');
    await expect(galleryImages.first()).toBeVisible();
  });

  test('shows error message for non-existent trip', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('explore non-existent-trip');
    await input.press('Enter');

    // Verify error message appears
    await expect(page.locator('text=Travel story not found')).toBeVisible();
  });

  test('shows usage hint when explore command has no slug', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('explore');
    await input.press('Enter');

    // Verify usage message appears
    await expect(page.locator('text=Usage: explore <slug>')).toBeVisible();
  });

  test('trips alias works for travel command', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('trips');
    await input.press('Enter');

    // Verify the travel list appears
    await expect(page.locator('text=~/travel')).toBeVisible();
  });
});
