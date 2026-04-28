import { Page, Locator, expect } from '@playwright/test';

/**
 * RegisterPage - Page Object Model for the Registration page
 * 
 * This class encapsulates all locators and actions related to the Register page.
 * Following POM best practices for maintainability and reusability.
 */
export class RegisterPage {
    // Page instance
    readonly page: Page;

    // =========================================
    // LOCATORS - Using readonly for immutability
    // =========================================

    /** Username input field */
    readonly usernameInput: Locator;

    /** Email input field */
    readonly emailInput: Locator;

    /** Password input field */
    readonly passwordInput: Locator;

    /** Confirm Password input field */
    readonly confirmPasswordInput: Locator;

    /** Register/Submit button */
    readonly registerButton: Locator;

    /** Reset button to clear form */
    readonly resetButton: Locator;

    /** Password visibility toggle button */
    readonly passwordToggle: Locator;

    /** Confirm Password visibility toggle button */
    readonly confirmPasswordToggle: Locator;

    /** Register navigation link */
    readonly registerNavLink: Locator;

    /**
     * Constructor - Initialize all locators
     * @param page - Playwright Page instance
     */
    constructor(page: Page) {
        this.page = page;

        // Initialize form field locators
        this.usernameInput = page.locator('#username');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.confirmPasswordInput = page.locator('#confirmPassword');

        // Initialize button locators
        this.registerButton = page.locator('button[type="submit"]');
        this.resetButton = page.locator('button:has-text("Reset")');

        // Initialize password toggle locators (eye icons in password fields)
        // These are buttons with absolute positioning inside the password field containers
        this.passwordToggle = page.locator('#password + button, #password ~ button').first();
        this.confirmPasswordToggle = page.locator('#confirmPassword + button, #confirmPassword ~ button').first();

        // Navigation link
        this.registerNavLink = page.locator('a[href="/register"]');
    }

    // =========================================
    // PAGE ACTIONS - Reusable methods
    // =========================================

    /**
     * Navigate to the Register page
     */
    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.registerNavLink.click();
        await this.page.waitForURL('**/register');
    }

    /**
     * Navigate directly to the Register page
     * Note: Direct URL /register returns 404, so we navigate via homepage
     */
    async navigateDirect(): Promise<void> {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
        await this.registerNavLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Scroll to the Automation Challenge section
     */
    async scrollToAutomationChallenge(): Promise<void> {
        const challengeSection = this.page.locator('text=Automation Challenge');
        await challengeSection.scrollIntoViewIfNeeded();
    }

    /**
     * Fill the registration form with provided data
     * @param username - Username value
     * @param email - Email value
     * @param password - Password value
     * @param confirmPassword - Confirm password value
     */
    async fillRegistrationForm(
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    ): Promise<void> {
        await this.usernameInput.fill(username);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    /**
     * Fill only specific fields (useful for partial form testing)
     * @param fields - Object containing field values to fill
     */
    async fillFields(fields: {
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }): Promise<void> {
        if (fields.username !== undefined) {
            await this.usernameInput.fill(fields.username);
        }
        if (fields.email !== undefined) {
            await this.emailInput.fill(fields.email);
        }
        if (fields.password !== undefined) {
            await this.passwordInput.fill(fields.password);
        }
        if (fields.confirmPassword !== undefined) {
            await this.confirmPasswordInput.fill(fields.confirmPassword);
        }
    }

    /**
     * Click the Register/Submit button
     */
    async submitForm(): Promise<void> {
        await this.registerButton.click();
    }

    /**
     * Click the Reset button to clear the form
     */
    async resetForm(): Promise<void> {
        await this.resetButton.click();
    }

    /**
     * Toggle password visibility for the password field
     */
    async togglePasswordVisibility(): Promise<void> {
        await this.passwordToggle.click();
    }

    /**
     * Toggle password visibility for the confirm password field
     */
    async toggleConfirmPasswordVisibility(): Promise<void> {
        await this.confirmPasswordToggle.click();
    }

    /**
     * Get the input type of the password field (text or password)
     * @returns The type attribute value
     */
    async getPasswordInputType(): Promise<string | null> {
        return await this.passwordInput.getAttribute('type');
    }

    /**
     * Get the input type of the confirm password field (text or password)
     * @returns The type attribute value
     */
    async getConfirmPasswordInputType(): Promise<string | null> {
        return await this.confirmPasswordInput.getAttribute('type');
    }

    /**
     * Get all visible error messages on the page
     * @returns Array of error message texts
     */
    async getErrorMessages(): Promise<string[]> {
        // Wait a moment for error messages to appear
        await this.page.waitForTimeout(500);

        // Look for error messages (typically styled with red/destructive classes)
        const errorElements = this.page.locator('.text-destructive, .text-red-500, [class*="error"], .error-message');
        const count = await errorElements.count();

        const messages: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = await errorElements.nth(i).textContent();
            if (text && text.trim()) {
                messages.push(text.trim());
            }
        }

        return messages;
    }

    /**
     * Get error message for a specific field
     * @param fieldLocator - The field locator to check for associated error
     * @returns Error message text or null
     */
    async getFieldError(fieldLocator: Locator): Promise<string | null> {
        // Look for error message as a sibling or nearby element
        const parent = fieldLocator.locator('..');
        const errorElement = parent.locator('.text-destructive, .text-red-500, [class*="error"]');

        if (await errorElement.count() > 0) {
            return await errorElement.first().textContent();
        }

        return null;
    }

    /**
     * Check if the registration was successful (redirect occurred)
     * @returns True if redirected away from register page
     */
    async isRegistrationSuccessful(): Promise<boolean> {
        try {
            await this.page.waitForURL((url) => !url.pathname.includes('/register'), {
                timeout: 5000
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get the current URL
     * @returns Current page URL
     */
    getCurrentUrl(): string {
        return this.page.url();
    }

    /**
     * Check if all form fields are empty
     * @returns True if all fields are empty
     */
    async areAllFieldsEmpty(): Promise<boolean> {
        const usernameValue = await this.usernameInput.inputValue();
        const emailValue = await this.emailInput.inputValue();
        const passwordValue = await this.passwordInput.inputValue();
        const confirmPasswordValue = await this.confirmPasswordInput.inputValue();

        return !usernameValue && !emailValue && !passwordValue && !confirmPasswordValue;
    }

    /**
     * Wait for the page to be fully loaded
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify the Register page is displayed
     */
    async verifyPageLoaded(): Promise<void> {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.confirmPasswordInput).toBeVisible();
        await expect(this.registerButton).toBeVisible();
    }
}
