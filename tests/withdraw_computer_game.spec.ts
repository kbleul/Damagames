import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://test.damagames.com/');
    await page.getByRole('button', { name: 'Play With computer' }).click();
    await page.locator('div:nth-child(6) > div:nth-child(6) > div > .square').click();
    await page.locator('div:nth-child(5) > div:nth-child(5) > div > .square').click();
    await page.locator('div:nth-child(5) > div:nth-child(5) > div > .square').click();
    await page.locator('div:nth-child(4) > div:nth-child(4) > div > .square').click();
    await page.getByRole('button', { name: 'Exit' }).click();
    await page.getByRole('heading', { name: 'You are about to leave this game !' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page).toHaveURL(/create-game/);
});