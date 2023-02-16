import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Dama/);
});

test('Create Game', async ({ page }) => {
    await page.goto('/');

    // Wait for the "Create Game" button to appear and click it
    const createGameButton = await page.waitForSelector('button', { text: 'Create Game' });
    await createGameButton.click();
    // TODO: fix UI
    // somehow without a hard timeout the UI becomes flaky and the game is not created
    await page.waitForTimeout(1000);
    // Wait for the page to navigate to the new URL
    await page.waitForLoadState('networkidle', { timeout: 5000 });

    // Wait for the text input to appear and fill it
    const nameInput = await page.waitForSelector('input[type="text"]');
    await nameInput.fill('testrunner');

    // Wait for the "Create" button to appear and click it
    const createButton = await page.waitForSelector('button', { text: 'Create' });
    await createButton.click();
    // Wait for the heading to appear and assert its text
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    await expect(page.getByRole('heading')).toHaveText(/Great Work/);
});