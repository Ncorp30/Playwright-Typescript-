import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import {
    validLoginScenarios,
    validationErrorScenarios,
    specialCharacterScenarios,
    boundaryTestScenarios,
    LoginTestScenario,
    ValidationTestScenario
} from '../test-data/loginData';

/**
 * Data-Driven Login Tests
 * 
 * This test suite demonstrates data-driven testing with Playwright.
 * Tests are parameterized using external test data for comprehensive coverage.
 */

test.describe('Data-Driven Login Tests', () => {
    let loginPage: LoginPage;

    // =========================================
    // SETUP - Before each test
    // =========================================
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.verifyPageLoaded();
    });

    // =========================================
    // VALID LOGIN SCENARIOS - Parameterized Tests
    // =========================================
    test.describe('Valid Login Scenarios', () => {
        for (const scenario of validLoginScenarios) {
            test(`${scenario.testId} - ${scenario.description}`, async ({ page }) => {
                // Arrange & Act
                await loginPage.fillLoginForm(scenario.username, scenario.password);
                await loginPage.submitForm();

                // Assert: Should redirect to account page
                await expect(page).toHaveURL(/.*\/account/);
            });
        }
    });

    // =========================================
    // VALIDATION ERROR SCENARIOS - Parameterized Tests
    // =========================================
    test.describe('Validation Error Scenarios', () => {
        for (const scenario of validationErrorScenarios) {
            test(`${scenario.testId} - ${scenario.description}`, async () => {
                // Arrange & Act
                await loginPage.fillLoginForm(scenario.username, scenario.password);
                await loginPage.submitForm();

                // Assert: Should show expected errors
                const errors = await loginPage.getErrorMessages();

                for (const expectedError of scenario.expectedErrors) {
                    const hasError = errors.some(error =>
                        error.toLowerCase().includes(expectedError.toLowerCase().split(' ')[0])
                    );
                    expect(hasError).toBeTruthy();
                }

                // Should stay on login page
                expect(loginPage.getCurrentUrl()).toContain('/login');
            });
        }
    });

    // =========================================
    // SPECIAL CHARACTER SCENARIOS - Parameterized Tests
    // =========================================
    test.describe('Special Character Handling', () => {
        for (const scenario of specialCharacterScenarios) {
            test(`${scenario.testId} - ${scenario.description}`, async ({ page }) => {
                // Arrange & Act
                await loginPage.fillLoginForm(scenario.username, scenario.password);
                await loginPage.submitForm();

                // Assert: App should handle gracefully (not crash)
                await page.waitForTimeout(1000);
                const currentUrl = page.url();

                // Should be on either account page (success) or login page (handled error)
                expect(currentUrl).toMatch(/\/(account|login)/);
            });
        }
    });

    // =========================================
    // BOUNDARY TEST SCENARIOS - Parameterized Tests
    // =========================================
    test.describe('Boundary Testing', () => {
        for (const scenario of boundaryTestScenarios) {
            test(`${scenario.testId} - ${scenario.description}`, async ({ page }) => {
                // Arrange & Act
                await loginPage.fillLoginForm(scenario.username, scenario.password);
                await loginPage.submitForm();

                // Assert: Should handle edge cases gracefully (not crash)
                // Some edge cases may be rejected by the app or succeed
                await page.waitForTimeout(1000);
                const currentUrl = page.url();

                // App should handle gracefully - either redirect or stay on login
                expect(currentUrl).toMatch(/\/(account|login)/);
            });
        }
    });
});

// =========================================
// ALTERNATIVE: Using test.each() Pattern
// =========================================
test.describe('Alternative Data-Driven Pattern (forEach)', () => {

    // Using forEach with array of test data
    const quickLoginTests = [
        { user: 'quickuser1', pass: 'QuickPass123!', desc: 'Simple credentials' },
        { user: 'admin@test.com', pass: 'Admin123!', desc: 'Email username' },
        { user: 'test_user', pass: 'Test@Pass1', desc: 'Underscore username' },
    ];

    quickLoginTests.forEach(({ user, pass, desc }) => {
        test(`Quick Login Test: ${desc}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.navigate();
            await loginPage.verifyPageLoaded();

            await loginPage.fillLoginForm(user, pass);
            await loginPage.submitForm();

            await expect(page).toHaveURL(/.*\/account/);
        });
    });
});

// =========================================
// COMPREHENSIVE: Combined Matrix Testing
// =========================================
test.describe('Username-Password Matrix Testing', () => {
    const usernames = ['testuser', 'admin', 'user@test.com'];
    const passwords = ['Password1!', 'SecurePass@2024', 'Test123#'];

    // Generate all combinations
    for (const username of usernames) {
        for (const password of passwords) {
            test(`Matrix: ${username} + ${password.substring(0, 5)}...`, async ({ page }) => {
                const loginPage = new LoginPage(page);
                await loginPage.navigate();
                await loginPage.verifyPageLoaded();

                await loginPage.fillLoginForm(username, password);
                await loginPage.submitForm();

                // All valid combinations should succeed
                await expect(page).toHaveURL(/.*\/account/);
            });
        }
    }
});
