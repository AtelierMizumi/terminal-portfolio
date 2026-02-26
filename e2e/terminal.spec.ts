import { test, expect } from '@playwright/test';

test.describe('Terminal OS Features', () => {

    test('Boot sequence plays and transitions to desktop', async ({ page }) => {
        // Navigate to local app
        await page.goto('/');

        // Wait for the boot sequence text to appear
        const bootContainer = page.locator('.font-mono.text-green-500');
        await expect(bootContainer).toBeVisible();
        await expect(bootContainer).toContainText(/AMD Ryzen 9/);

        // After animation (max 8-10s), the desktop should be visible
        // We can check for the TopBar or Desktop icons
        const topBar = page.locator('div.flex.items-center.space-x-4').first();
        await expect(topBar).toBeVisible({ timeout: 15000 });

        // Check that terminal is focused by default
        const terminalInput = page.locator('.xterm-helper-textarea');
        await expect(terminalInput).toBeAttached();
    });

    test('Terminal can open music player via command', async ({ page }) => {
        // Clear session storage so boot screen plays (or skip it if already checked)
        // We'll just wait for the desktop to load
        await page.goto('/');

        const topBar = page.locator('div.flex.items-center.space-x-4').first();
        await expect(topBar).toBeVisible({ timeout: 15000 });

        // Type the open music command into the terminal
        // We have to use page.keyboard because xterm.js has a hidden tiny textarea
        await page.keyboard.press('Escape'); // Ensure focus is somewhere

        // The actual terminal container
        const terminalElement = page.locator('.terminal.xterm').first();
        await terminalElement.click();

        await page.keyboard.type('open music');
        await page.keyboard.press('Enter');

        // Verify Music Player window appears
        const musicWindowHeader = page.getByText('Music Player', { exact: true }).first();
        await expect(musicWindowHeader).toBeVisible();

        // Close it by finding the close button within the same window header or window
        // Window header contains .window-controls > .close and .window-title containing "Music Player"
        // So we can find the window first:
        const musicWindow = page.locator('.window', { has: page.locator('.window-title', { hasText: 'Music Player' }) }).first();

        // Then click the close button inside it
        const closeButton = musicWindow.locator('.window-control.close').first();
        await closeButton.click();

        // Verify it's gone
        await expect(musicWindow).toBeHidden();
    });

    test('Window Mechanics - Dragging', async ({ page }) => {
        // Navigate to local app
        await page.goto('/');

        const topBar = page.locator('div.flex.items-center.space-x-4').first();
        await expect(topBar).toBeVisible({ timeout: 15000 });

        // Ensure focus and type 'open music'
        await page.keyboard.press('Escape');
        const terminalElement = page.locator('.terminal.xterm').first();
        await terminalElement.click();
        await page.keyboard.type('open music');
        await page.keyboard.press('Enter');

        // Wait for the window to appear
        const musicWindow = page.locator('.window', { has: page.locator('.window-title', { hasText: 'Music Player' }) }).first();
        await expect(musicWindow).toBeVisible();

        // The header is the drag handle
        const header = musicWindow.locator('.window-header');

        // Get initial bounding box to see where it started
        const initialBox = await musicWindow.boundingBox();
        expect(initialBox).not.toBeNull();

        // Perform a drag interaction using mouse
        // Move to center of header
        await header.hover();
        await page.mouse.down();

        // Drag down and to the right
        await page.mouse.move(initialBox!.x + initialBox!.width / 2 + 100, initialBox!.y + 100, { steps: 10 });
        await page.mouse.up();

        // Verify it moved
        const newBox = await musicWindow.boundingBox();
        expect(newBox).not.toBeNull();

        expect(newBox!.x).toBeGreaterThan(initialBox!.x + 50); // It should have moved right
        expect(newBox!.y).toBeGreaterThan(initialBox!.y + 50); // It should have moved down
    });

});
