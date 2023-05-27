import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Dama/);
});

test("onboarding", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Select / ምረጥ" }).click();
  await page.getByRole("button", { name: "Start Tour" }).click();
  await page.getByRole("button", { name: "Skip" }).click();
});

test("Create Game", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Select / ምረጥ" }).click();
  await page.getByRole("button", { name: "Start Tour" }).click();
  await page.getByRole("button", { name: "Skip" }).click();

  await page.waitForTimeout(5000);

  try {
    await page.getByRole("button", { name: "Start Tour" }).click();
  } catch {
    console.log("Start Tour btn not found");
  }

  await page.getByRole("button", { name: "Play with Computer" }).click();

  await page.waitForTimeout(5000);

  await expect(page.url()).toMatch(/game\/1$/);
});
