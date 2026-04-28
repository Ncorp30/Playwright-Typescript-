import { Page, expect } from '@playwright/test';

/**
 * Helper Utilities for Playwright Tests
 * 
 * This file contains reusable utility functions that can be used
 * across multiple test files for common operations.
 */

// =========================================
// RANDOM DATA GENERATORS
// =========================================

/**
 * Generate a random string of specified length
 * @param length - Length of the string to generate
 * @returns Random alphanumeric string
 */
export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Generate a random email address
 * @returns Random email address
 */
export function generateRandomEmail(): string {
    const timestamp = Date.now();
    const randomPart = generateRandomString(5);
    return `test_${randomPart}_${timestamp}@example.com`;
}

/**
 * Generate a random username
 * @returns Random username
 */
export function generateRandomUsername(): string {
    const timestamp = Date.now();
    return `user_${timestamp}`;
}

/**
 * Generate a secure random password
 * @param length - Minimum length (default: 12)
 * @returns Secure password with mixed characters
 */
export function generateSecurePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';

    // Ensure at least one of each type
    let password =
        uppercase.charAt(Math.floor(Math.random() * uppercase.length)) +
        lowercase.charAt(Math.floor(Math.random() * lowercase.length)) +
        numbers.charAt(Math.floor(Math.random() * numbers.length)) +
        special.charAt(Math.floor(Math.random() * special.length));

    // Fill the rest
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// =========================================
// WAIT UTILITIES
// =========================================

/**
 * Wait for a specified duration
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for an element to be visible and stable
 * @param page - Playwright Page instance
 * @param selector - CSS selector for the element
 * @param timeout - Maximum time to wait (default: 10000ms)
 */
export async function waitForElementStable(
    page: Page,
    selector: string,
    timeout: number = 10000
): Promise<void> {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    // Additional wait for any animations to complete
    await wait(100);
}

/**
 * Wait for network to be idle
 * @param page - Playwright Page instance
 * @param timeout - Maximum time to wait (default: 30000ms)
 */
export async function waitForNetworkIdle(
    page: Page,
    timeout: number = 30000
): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
}

// =========================================
// ASSERTION HELPERS
// =========================================

/**
 * Assert that an element contains specific text (case-insensitive)
 * @param page - Playwright Page instance
 * @param selector - CSS selector for the element
 * @param expectedText - Text to look for
 */
export async function assertContainsText(
    page: Page,
    selector: string,
    expectedText: string
): Promise<void> {
    const element = page.locator(selector);
    await expect(element).toContainText(expectedText, { ignoreCase: true });
}

/**
 * Assert that a form field is empty
 * @param page - Playwright Page instance
 * @param selector - CSS selector for the input field
 */
export async function assertFieldIsEmpty(
    page: Page,
    selector: string
): Promise<void> {
    const element = page.locator(selector);
    await expect(element).toHaveValue('');
}

/**
 * Assert that a form field has a specific value
 * @param page - Playwright Page instance
 * @param selector - CSS selector for the input field
 * @param expectedValue - Expected value
 */
export async function assertFieldHasValue(
    page: Page,
    selector: string,
    expectedValue: string
): Promise<void> {
    const element = page.locator(selector);
    await expect(element).toHaveValue(expectedValue);
}

/**
 * Assert that an element is visible
 * @param page - Playwright Page instance
 * @param selector - CSS selector for the element
 */
export async function assertElementVisible(
    page: Page,
    selector: string
): Promise<void> {
    const element = page.locator(selector);
    await expect(element).toBeVisible();
}

/**
 * Assert that an element is not visible
 * @param page - Playwright Page instance
 * @param selector - CSS selector for the element
 */
export async function assertElementNotVisible(
    page: Page,
    selector: string
): Promise<void> {
    const element = page.locator(selector);
    await expect(element).not.toBeVisible();
}

// =========================================
// URL HELPERS
// =========================================

/**
 * Assert current URL contains specific path
 * @param page - Playwright Page instance
 * @param expectedPath - Path that URL should contain
 */
export async function assertUrlContains(
    page: Page,
    expectedPath: string
): Promise<void> {
    await expect(page).toHaveURL(new RegExp(expectedPath));
}

/**
 * Assert current URL equals specific path
 * @param page - Playwright Page instance
 * @param expectedUrl - Expected full URL
 */
export async function assertUrlEquals(
    page: Page,
    expectedUrl: string
): Promise<void> {
    await expect(page).toHaveURL(expectedUrl);
}

// =========================================
// SCREENSHOT UTILITIES
// =========================================

/**
 * Take a screenshot with timestamp in filename
 * @param page - Playwright Page instance
 * @param baseName - Base name for the screenshot
 * @returns Path to the saved screenshot
 */
export async function takeTimestampedScreenshot(
    page: Page,
    baseName: string
): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `./screenshots/${baseName}_${timestamp}.png`;
    await page.screenshot({ path, fullPage: true });
    return path;
}

// =========================================
// INPUT HELPERS
// =========================================

/**
 * Clear and type into an input field
 * @param page - Playwright Page instance
 * @param selector - CSS selector for the input
 * @param text - Text to type
 */
export async function clearAndType(
    page: Page,
    selector: string,
    text: string
): Promise<void> {
    const element = page.locator(selector);
    await element.clear();
    await element.fill(text);
}

/**
 * Type text character by character with delay (simulates real typing)
 * @param page - Playwright Page instance
 * @param selector - CSS selector for the input
 * @param text - Text to type
 * @param delay - Delay between characters in ms (default: 50)
 */
export async function typeSlowly(
    page: Page,
    selector: string,
    text: string,
    delay: number = 50
): Promise<void> {
    const element = page.locator(selector);
    await element.click();
    await element.pressSequentially(text, { delay });
}
