import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('https://test.damagames.com/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Dama/);
});

test('Create Game', async ({ page }) => {
    await page.goto('https://test.damagames.com/');

    // Click the get started link.
    await page.getByRole('button', { name: 'Create Game' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/new-game/);
    //await page.screenshot({ path: 'choose_name.png' });
});
