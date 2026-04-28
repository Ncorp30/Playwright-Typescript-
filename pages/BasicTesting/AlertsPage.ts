import { Page, Locator, expect, Dialog } from '@playwright/test';

/**
 * AlertsPage - Page Object Model for the Alerts page
 * 
 * This class encapsulates all locators and actions related to the Alerts page.
 * Handles native JavaScript dialogs (alert, confirm, prompt) and custom toast notifications.
 * Following POM best practices for maintainability and reusability.
 */
export class AlertsPage {
    // Page instance
    readonly page: Page;

    // =========================================
    // LOCATORS - Native Alert Triggers
    // =========================================

    /** Button to trigger standard JS alert */
    readonly triggerAlertButton: Locator;

    /** Button to trigger confirm dialog */
    readonly triggerConfirmButton: Locator;

    /** Button to trigger prompt dialog */
    readonly triggerPromptButton: Locator;

    // =========================================
    // LOCATORS - Toast Triggers
    // =========================================

    /** Button to show success toast */
    readonly showSuccessToastButton: Locator;

    /** Button to show error toast */
    readonly showErrorToastButton: Locator;

    // =========================================
    // LOCATORS - Navigation & Toast
    // =========================================

    /** Navigation locator for Alerts page */
    readonly alertsNav: Locator;

    /** Toast notification */
    readonly toastNotification: Locator;

    /**
     * Constructor - Initialize all locators
     * @param page - Playwright Page instance
     */
    constructor(page: Page) {
        this.page = page;

        // Native Alert Triggers - use getByRole with exact button text
        this.triggerAlertButton = page.getByRole('button', { name: 'Trigger Alert' });
        this.triggerConfirmButton = page.getByRole('button', { name: 'Trigger Confirm' });
        this.triggerPromptButton = page.getByRole('button', { name: 'Trigger Prompt' });

        // Toast Triggers
        this.showSuccessToastButton = page.getByRole('button', { name: 'Show Success Toast' });
        this.showErrorToastButton = page.getByRole('button', { name: 'Show Error Toast' });

        // Navigation
        this.alertsNav = page.locator('a[href="/alerts"]');

        // Toast notification (common patterns for toast libraries)
        this.toastNotification = page.locator('[role="status"], [data-sonner-toast], .toast, [class*="toast"]').first();
    }

    // =========================================
    // PAGE ACTIONS - Navigation
    // =========================================

    /**
     * Navigate to the Alerts page via sidebar (required for SPA routing)
     * Direct URL navigation may return 404 on Azure Static Web Apps
     */
    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
        await this.alertsNav.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Wait for the page to be fully loaded
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify the Alerts page is displayed
     */
    async verifyPageLoaded(): Promise<void> {
        await expect(this.triggerAlertButton).toBeVisible();
        await expect(this.triggerConfirmButton).toBeVisible();
        await expect(this.triggerPromptButton).toBeVisible();
    }

    // =========================================
    // PAGE ACTIONS - Native JavaScript Alerts
    // =========================================

    /**
     * Trigger a standard JavaScript alert and accept it
     * @returns The alert message text
     */
    async triggerStandardAlert(): Promise<string> {
        let alertMessage = '';

        // Set up dialog listener before triggering
        const dialogHandler = (dialog: Dialog) => {
            alertMessage = dialog.message();
            dialog.accept();
        };

        this.page.once('dialog', dialogHandler);
        await this.triggerAlertButton.click();

        // Wait for dialog to be handled
        await this.page.waitForTimeout(500);

        return alertMessage;
    }

    /**
     * Trigger a confirm dialog and either accept or dismiss it
     * @param accept - Whether to accept (true) or dismiss (false) the dialog
     * @returns Object containing the confirm message and resulting toast
     */
    async triggerConfirmDialog(accept: boolean): Promise<{ confirmMessage: string; toastMessage: string }> {
        let confirmMessage = '';

        // Set up dialog listener before triggering
        const dialogHandler = async (dialog: Dialog) => {
            confirmMessage = dialog.message();
            if (accept) {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        };

        this.page.once('dialog', dialogHandler);
        await this.triggerConfirmButton.click();

        // Wait for dialog to be handled and toast to appear
        await this.page.waitForTimeout(500);

        const toastMessage = await this.getToastMessage();
        return { confirmMessage, toastMessage };
    }

    /**
     * Trigger a prompt dialog, enter text, and either accept or dismiss it
     * @param text - Text to enter in the prompt (ignored if dismiss is true)
     * @param accept - Whether to accept (true) or dismiss (false) the dialog
     * @returns Object containing the prompt message and resulting toast
     */
    async triggerPromptDialog(text: string, accept: boolean): Promise<{ promptMessage: string; toastMessage: string }> {
        let promptMessage = '';

        // Set up dialog listener before triggering
        const dialogHandler = async (dialog: Dialog) => {
            promptMessage = dialog.message();
            if (accept) {
                await dialog.accept(text);
            } else {
                await dialog.dismiss();
            }
        };

        this.page.once('dialog', dialogHandler);
        await this.triggerPromptButton.click();

        // Wait for dialog to be handled and toast to appear
        await this.page.waitForTimeout(500);

        const toastMessage = await this.getToastMessage();
        return { promptMessage, toastMessage };
    }

    // =========================================
    // PAGE ACTIONS - Toast Notifications
    // =========================================

    /**
     * Click the success toast button and return the toast message
     * @returns Toast message text
     */
    async showSuccessToast(): Promise<string> {
        await this.showSuccessToastButton.click();
        await this.page.waitForTimeout(300);
        return await this.getToastMessage();
    }

    /**
     * Click the error toast button and return the toast message
     * @returns Toast message text
     */
    async showErrorToast(): Promise<string> {
        await this.showErrorToastButton.click();
        await this.page.waitForTimeout(300);
        return await this.getToastMessage();
    }

    /**
     * Get the toast notification message
     * @returns Toast message text
     */
    async getToastMessage(): Promise<string> {
        try {
            await this.toastNotification.waitFor({ state: 'visible', timeout: 3000 });
            const text = await this.toastNotification.textContent();
            return text?.trim() || '';
        } catch {
            return '';
        }
    }

    /**
     * Wait for toast to disappear from the DOM
     * @returns True if toast disappeared, false if timeout
     */
    async waitForToastToDisappear(): Promise<boolean> {
        try {
            await this.toastNotification.waitFor({ state: 'hidden', timeout: 6000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verify toast is visible
     * @returns True if toast is visible
     */
    async isToastVisible(): Promise<boolean> {
        try {
            await this.toastNotification.waitFor({ state: 'visible', timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }

    // =========================================
    // PAGE ACTIONS - Comprehensive Testing
    // =========================================

    /**
     * Get all trigger buttons on the page
     * @returns Array of button locators
     */
    getAllTriggerButtons(): Locator[] {
        return [
            this.triggerAlertButton,
            this.triggerConfirmButton,
            this.triggerPromptButton,
            this.showSuccessToastButton,
            this.showErrorToastButton
        ];
    }
}
