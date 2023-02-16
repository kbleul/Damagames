const { test, expect } = require('@playwright/test');

test('alice and bob playing public game', async ({ browser }, workerInfo) => {
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
    
    await alicePage.goto('/');
    await bobPage.goto('/');

    await alicePage.waitForSelector('text=Public Game');
    await alicePage.click('text=Public Game');
    //await alicePage.waitForLoadState('networkidle', { timeout: 5000 });
    // TODO: fix UI
    // somehow without a hard timeout the UI becomes flaky and the game is not created
    await alicePage.waitForTimeout(1000);
    await alicePage.waitForSelector('text=Create Game');
    await alicePage.click('text=Create Game');
    await alicePage.waitForLoadState('networkidle', { timeout: 5000 });
    await expect(alicePage).toHaveURL(/new-game-public/);
    await alicePage.waitForSelector('input');
    await alicePage.fill('input', `alice-${projectIdentifier}`);
    //await alicePage.press('input', 'Tab');
    await alicePage.waitForLoadState('networkidle', { timeout: 5000 });
    await alicePage.waitForSelector('button:has-text("Create")');
    await alicePage.click('button:has-text("Create")');
    // Wait for the heading to appear and assert its text
    await alicePage.waitForLoadState('networkidle', { timeout: 5000 });
    await expect(alicePage.getByRole('heading')).toHaveText(/Great Work/);

    await bobPage.waitForSelector('text=Public Game');
    await bobPage.click('text=Public Game');
    await bobPage.waitForSelector('text=Join Game');
    await bobPage.click('text=Join Game');
    await alicePage.waitForLoadState('networkidle', { timeout: 5000 });
    await bobPage.waitForSelector(`section:has-text("${projectIdentifier}")`);
    const section = await bobPage.$(`section:has-text("${projectIdentifier}")`);
    const joinButton = await section.waitForSelector('a:has-text("Join")');
    // click join button twice because of bug
    await joinButton.click();
    await joinButton.click();
    await bobPage.waitForLoadState('networkidle', { timeout: 5000 });
    await bobPage.waitForSelector('input[placeholder="Tell us Your name"]');
    await bobPage.fill('input[placeholder="Tell us Your name"]', 'bob');
    await bobPage.waitForSelector('button:has-text("Join")');
    await bobPage.click('button:has-text("Join")');
    await bobPage.waitForSelector('button:has-text("Exit")');
    await bobPage.click('button:has-text("Exit")');
    await bobPage.waitForSelector('button:has-text("Yes")');
    await bobPage.click('button:has-text("Yes")');

    await alicePage.waitForSelector('button:has-text("Leave")');
    await alicePage.click('button:has-text("Leave")');
    await alicePage.waitForSelector('text=Public Game');
    await expect(alicePage).toHaveURL(/create-game/);

});