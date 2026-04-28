import { test, expect } from '@playwright/test';
import { AlertsPage } from '../../pages/BasicTesting/AlertsPage';

/**
 * Alerts Automation Tests
 * 
 * Test suite covering all 6 automation challenges for the Alerts page:
 * 1. Handle JS alert and verify text content
 * 2. Accept confirm dialog and verify toast message
 * 3. Cancel confirm dialog and verify toast message
 * 4. Enter text in prompt dialog and verify in toast
 * 5. Verify success/error toast content
 * 6. Verify toast notifications disappear from DOM
 */

test.describe('Alerts Automation Challenge', () => {
    let alertsPage: AlertsPage;

    test.beforeEach(async ({ page }) => {
        alertsPage = new AlertsPage(page);
        await alertsPage.navigate();
        await alertsPage.waitForPageLoad();
    });

    /**
     * Test Case 01: Standard JS Alert
     * Handle a JavaScript alert and verify its text content
     */
    test('TC01 - Handle standard JavaScript alert and verify text', async () => {
        // Verify page loaded
        await alertsPage.verifyPageLoaded();

        // Trigger alert and capture message
        const alertMessage = await alertsPage.triggerStandardAlert();

        // Verify alert message is not empty
        expect(alertMessage).not.toBe('');
        console.log('Alert message:', alertMessage);
    });

    /**
     * Test Case 02: Confirm Dialog - Accept
     * Click 'OK' on a confirm dialog and verify toast reflects confirmation
     */
    test('TC02 - Accept confirm dialog and verify confirmation toast', async () => {
        // Trigger confirm and accept it
        const result = await alertsPage.triggerConfirmDialog(true);

        // Verify confirm message is not empty
        expect(result.confirmMessage).not.toBe('');
        console.log('Confirm message:', result.confirmMessage);

        // Verify toast indicates confirmation was accepted
        expect(result.toastMessage.toLowerCase()).toMatch(/ok|confirm|accepted|yes/i);
        console.log('Toast after accept:', result.toastMessage);
    });

    /**
     * Test Case 03: Confirm Dialog - Cancel
     * Cancel a confirm dialog and verify toast reflects cancellation
     */
    test('TC03 - Cancel confirm dialog and verify cancellation toast', async () => {
        // Trigger confirm and dismiss it
        const result = await alertsPage.triggerConfirmDialog(false);

        // Verify confirm message is not empty
        expect(result.confirmMessage).not.toBe('');
        console.log('Confirm message:', result.confirmMessage);

        // Verify toast indicates confirmation was cancelled
        expect(result.toastMessage.toLowerCase()).toMatch(/cancel|dismiss|no/i);
        console.log('Toast after cancel:', result.toastMessage);
    });

    /**
     * Test Case 04: Prompt Dialog with Text Entry
     * Enter text into a prompt dialog and verify the entered text appears in toast
     */
    test('TC04 - Enter text in prompt dialog and verify in toast', async () => {
        const testText = 'Playwright Test Input';

        // Trigger prompt and enter text
        const result = await alertsPage.triggerPromptDialog(testText, true);

        // Verify prompt message is not empty
        expect(result.promptMessage).not.toBe('');
        console.log('Prompt message:', result.promptMessage);

        // Verify toast contains the entered text
        expect(result.toastMessage).toContain(testText);
        console.log('Toast after prompt:', result.toastMessage);
    });

    /**
     * Test Case 05: Success Toast Notification
     * Capture and verify success toast notification appears with correct content
     */
    test('TC05 - Verify success toast appears with correct content', async () => {
        // Show success toast
        const toastMessage = await alertsPage.showSuccessToast();

        // Verify toast is visible
        const isVisible = await alertsPage.isToastVisible();
        expect(isVisible).toBe(true);

        // Verify toast contains relevant content (custom toast shows "Custom Alert")
        expect(toastMessage.toLowerCase()).toMatch(/custom|alert|toast/i);
        console.log('Success toast message:', toastMessage);
    });

    /**
     * Test Case 06: Error Toast Notification
     * Capture and verify error toast notification appears with correct content
     */
    test('TC06 - Verify error toast appears with correct content', async () => {
        // Show error toast
        const toastMessage = await alertsPage.showErrorToast();

        // Verify toast is visible
        const isVisible = await alertsPage.isToastVisible();
        expect(isVisible).toBe(true);

        // Verify toast contains error-related content
        expect(toastMessage.toLowerCase()).toMatch(/error|failed|failure/i);
        console.log('Error toast message:', toastMessage);
    });

    /**
     * Test Case 07: Toast Disappears from DOM
     * Implement wait strategy for toast notifications to disappear
     */
    test('TC07 - Verify toast notifications disappear from DOM', async () => {
        // Show success toast first
        await alertsPage.showSuccessToast();

        // Verify toast is visible initially
        const isVisibleBefore = await alertsPage.isToastVisible();
        expect(isVisibleBefore).toBe(true);

        // Wait for toast to disappear
        const disappeared = await alertsPage.waitForToastToDisappear();
        expect(disappeared).toBe(true);

        console.log('Toast successfully disappeared from DOM');
    });

    /**
     * Test Case 08: All Alert Triggers Visibility
     * Verify all alert trigger buttons are visible on the page
     */
    test('TC08 - All alert triggers and buttons are visible', async () => {
        // Verify all trigger buttons are visible
        await expect(alertsPage.triggerAlertButton).toBeVisible();
        await expect(alertsPage.triggerConfirmButton).toBeVisible();
        await expect(alertsPage.triggerPromptButton).toBeVisible();
        await expect(alertsPage.showSuccessToastButton).toBeVisible();
        await expect(alertsPage.showErrorToastButton).toBeVisible();

        // Get all trigger buttons
        const allButtons = alertsPage.getAllTriggerButtons();
        expect(allButtons.length).toBe(5);

        // Verify each button is visible
        for (const button of allButtons) {
            await expect(button).toBeVisible();
        }

        console.log('All 5 alert trigger buttons are visible');
    });
});
