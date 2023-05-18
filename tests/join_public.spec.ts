const { test, expect } = require("@playwright/test");

test("alice and bob playing public game", async ({ browser }, workerInfo) => {
  // Create two isolated browser contexts
  const aliceContext = await browser.newContext();
  const bobContext = await browser.newContext();

  // Create pages and interact with contexts independently
  const alicePage = await aliceContext.newPage();
  const bobPage = await bobContext.newPage();

  // Generate a unique ID for this test instance
  const uniqueId = Date.now().toString();

  // Concatenate the project name and the unique ID into a single string
  const projectIdentifier = `${workerInfo.project.name}-${uniqueId}`;

  await alicePage.goto("/");
  await bobPage.goto("/");

  await alicePage.getByRole("button", { name: "Select / ምረጥ" }).click();
  await alicePage.getByRole("button", { name: "Start Tour" }).click();
  await alicePage.getByRole("button", { name: "Skip" }).click();

  await alicePage.waitForTimeout(5000);

  try {
    await alicePage.getByRole("button", { name: "Start Tour" }).click();
  } catch {
    console.log("Start Tour btn not found");
  }

  await alicePage.getByRole("button", { name: "Public Game" }).click();

  await alicePage.waitForTimeout(1000);

  await alicePage.getByRole("button", { name: "Create Game" }).click();

  await alicePage.waitForTimeout(1000);

  await expect(alicePage).toHaveURL(/new-game-public/);

  await alicePage.waitForSelector("input");
  await alicePage.fill("input", `alice-${projectIdentifier}`);
  //await alicePage.press('input', 'Tab');
  await alicePage.waitForLoadState("networkidle", { timeout: 15000 });
  await alicePage.waitForSelector('button:has-text("Create")');
  await alicePage.click('button:has-text("Create")');
  // Wait for the heading to appear and assert its text
  await alicePage.waitForLoadState("networkidle", { timeout: 15000 });
  await expect(alicePage.getByRole("heading")).toHaveText(/Great Work/);


  await bobPage.getByRole("button", { name: "Select / ምረጥ" }).click();
  await bobPage.getByRole("button", { name: "Start Tour" }).click();
  await bobPage.getByRole("button", { name: "Skip" }).click();

  await bobPage.waitForTimeout(5000);

  try {
    await bobPage.getByRole("button", { name: "Start Tour" }).click();
  } catch {
    console.log("Start Tour btn not found");
  }

  await bobPage.getByRole("button", { name: "Public Game" }).click();
  await bobPage.waitForTimeout(1000);
  await expect(bobPage).toHaveURL(/new-game-public/);
  await bobPage.waitForSelector("text=Join Game");
  await bobPage.click("text=Join Game");
  await bobPage.waitForTimeout(5000);
  await expect(bobPage).toHaveURL(/join-public/);

  await bobPage.waitForSelector(
    `section:has-text("alice-${projectIdentifier}")`
  );
  const section = await bobPage.$(
    `section:has-text("alice-${projectIdentifier}")`
  );
  const joinButton = await section.waitForSelector('button:has-text("Play")');
  // click join button twice because of bug
  await joinButton.click();

  await bobPage.waitForLoadState("networkidle", { timeout: 15000 });
  await bobPage.waitForSelector('input[placeholder="Tell us your name"]');
  await bobPage.fill('input[placeholder="Tell us your name"]', "bob");
  await bobPage.waitForSelector('button:has-text("Join")');
  await bobPage.click('button:has-text("Join")');
  await bobPage.waitForSelector('button:has-text("Exit")');
  await bobPage.click('button:has-text("Exit")');
  await bobPage.waitForSelector('button:has-text("Yes")');
  await bobPage.click('button:has-text("Yes")');

  await alicePage.waitForSelector('button:has-text("Leave")');
  await alicePage.click('button:has-text("Leave")');
  await alicePage.waitForSelector("text=Public Game");

  await expect(bobPage).toHaveURL(/create-game/);
  await expect(alicePage).toHaveURL(/create-game/);
});
