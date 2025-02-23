import { test, expect } from "@playwright/test";

test("withdraw_computer_game", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Select / ምረጥ" }).click();
  await page.getByRole("button", { name: "Start Tour" }).click();
  await page.getByRole("button", { name: "Skip" }).click();

  await page.waitForTimeout(1000);

  try {
    await page.getByRole("button", { name: "Start Tour" }).click();
  } catch {
    console.log("Start Tour btn not found");
  }
  await page.click("text=Play with Computer");

  await page.waitForTimeout(10000);

  await expect(page.url()).toMatch(/game\/1$/);

  await page.click("text=Next");
  await page.click("text=Done");

  await page.waitForTimeout(3000);

  await page
    .locator("div:nth-child(6) > div:nth-child(6) > div > .square")
    .click();

  await page.waitForTimeout(2000);

  await page
    .locator("div:nth-child(5) > div:nth-child(5) > div > .square")
    .click();

  // TODO: fix UI
  // somehow without a hard timeout the UI becomes flaky and the game is not created
  await page.waitForTimeout(1000);

  //await expect(page.getByRole('button', { name: 'Exit' })).toBeVisible;
  await expect(page.locator('button:has-text("Exit")')).toBeVisible();

  //await page.getByRole('button', { name: 'Exit' }).click();
  await page.click('button:has-text("Exit")');

  //await page.waitForLoadState('networkidle', { timeout: 5000 });
  //await page.getByRole('heading', { name: 'You are about to leave this game !' }).click();
  //await page.click('text=You are about to leave this game !');

  await page.waitForLoadState("networkidle", { timeout: 15000 });
  //await page.getByRole('button', { name: 'Yes' }).click();
  await page.click('button:has-text("Yes")');
  await expect(page).toHaveURL(/create-game/);
});
