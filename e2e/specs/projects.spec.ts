import { test, expect } from '@playwright/test';

test.describe('US4 - Browse Projects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for startup screen and skip it
    await page.waitForSelector('[data-testid="startup-screen"]', { timeout: 5000 }).catch(() => {});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('displays projects list when "projects" command is entered', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('projects');
    await input.press('Enter');

    // Verify the projects list header appears
    await expect(page.locator('text=~/projects')).toBeVisible();
  });

  test('shows project count in projects list', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('projects');
    await input.press('Enter');

    // Should show at least 1 project (the sample project)
    await expect(page.locator('text=/\\d+ projects? found/')).toBeVisible();
  });

  test('displays sample project in projects list', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('projects');
    await input.press('Enter');

    // Verify the sample project appears
    await expect(page.locator('text=Portfolio Website')).toBeVisible();
  });

  test('shows tech stack tags on project cards', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('projects');
    await input.press('Enter');

    // Verify tech stack tags are shown
    await expect(page.locator('text=React').first()).toBeVisible();
  });

  test('displays project details when "view <slug>" command is entered', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('view sample-project');
    await input.press('Enter');

    // Verify the project title appears
    await expect(page.locator('h1:has-text("Portfolio Website")')).toBeVisible();
  });

  test('displays external links in project detail', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('view sample-project');
    await input.press('Enter');

    // Verify demo link exists and opens in new tab
    const demoLink = page.locator('a:has-text("Live Demo")');
    await expect(demoLink).toBeVisible();
    await expect(demoLink).toHaveAttribute('target', '_blank');

    // Verify repo link exists and opens in new tab
    const repoLink = page.locator('a:has-text("Repository")');
    await expect(repoLink).toBeVisible();
    await expect(repoLink).toHaveAttribute('target', '_blank');
  });

  test('displays gallery images in project detail', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('view sample-project');
    await input.press('Enter');

    // Verify gallery section exists
    await expect(page.locator('text=Gallery')).toBeVisible();

    // Verify gallery images are loaded
    const galleryImages = page.locator('img[alt^="Gallery image"]');
    await expect(galleryImages.first()).toBeVisible();
  });

  test('shows error message for non-existent project', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('view non-existent-project');
    await input.press('Enter');

    // Verify error message appears
    await expect(page.locator('text=Project not found')).toBeVisible();
  });

  test('shows usage hint when view command has no slug', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('view');
    await input.press('Enter');

    // Verify usage message appears
    await expect(page.locator('text=Usage: view <slug>')).toBeVisible();
  });

  test('work alias works for projects command', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('work');
    await input.press('Enter');

    // Verify the projects list appears
    await expect(page.locator('text=~/projects')).toBeVisible();
  });
});
