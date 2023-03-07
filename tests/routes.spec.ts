import { test, expect } from "@playwright/test";

test("/", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await expect(page).toHaveTitle(/Dama/);
});

test("/new-game", async ({ page }) => {
  await page.goto("/new-game");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await expect(page).toHaveTitle(/Dama/);
});

test("/join-game", async ({ page }) => {
  await page.goto("/join-game");
  await page.waitForLoadState("networkidle", { timeout: 30000 });
  await expect(page).toHaveTitle(/Dama/);
});

// test('/new-game-public', async ({ page }) => {
//     await page.goto('/new-game-public');
//     await expect(page).toHaveTitle(/Dama/);
// });

// test('/join-public', async ({ page }) => {
//     await page.goto('/join-public');
//     await expect(page).toHaveTitle(/Dama/);
// });

// test('/score-board', async ({ page }) => {
//     await page.goto('/score-board');
//     await expect(page).toHaveTitle(/Dama/);
// });

// test('/privacy-policy', async ({ page }) => {
//     await page.goto('/privacy-policy');
//     await expect(page).toHaveTitle(/Dama/);
// });

// test('/login', async ({ page }) => {
//     await page.goto('/login');
//     await expect(page).toHaveTitle(/Dama/);
// });

// test('/store', async ({ page }) => {
//     await page.goto('/store');
//     await expect(page).toHaveTitle(/Dama/);
// });
