import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import {
    validLoginCredentials,
    emptyLoginCredentials,
    usernameOnlyCredentials,
    passwordOnlyCredentials,
    specialCharacterCredentials,
    expectedErrors
} from '../test-data/loginData';

/**
 * Login Page Test Suite
 * 
 * This test suite covers all the automation challenges for the Login page:
 * 1. Successful login with valid credentials
 * 2. Empty username validation
 * 3. Empty password validation
 * 4. Empty form submission validation
 * 5. Password visibility toggle
 * 6. Remember Me checkbox functionality
 * 7. Reset button functionality
 * 8. Navigation to Register page
 */
test.describe('Login Page Tests', () => {
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
    // TEST CASE 1: Successful Login
    // =========================================
    test('TC001 - Should login successfully with valid credentials', async ({ page }) => {
        // Arrange: Valid credentials from test data
        const { username, password } = validLoginCredentials;

        // Act: Fill form and submit
        await loginPage.fillLoginForm(username, password);
        await loginPage.submitForm();

        // Assert: Should redirect to account page
        await expect(page).toHaveURL(/.*\/account/);

        // Verify user is logged in by checking page content
        const pageContent = await page.textContent('body');
        expect(pageContent).toContain(username);
    });

    // =========================================
    // TEST CASE 2: Empty Username Validation
    // =========================================
    test('TC002 - Should show error when username is empty', async () => {
        // Arrange: Only password filled
        await loginPage.fillFields({
            username: '',
            password: 'SecurePass123!'
        });

        // Act: Submit form
        await loginPage.submitForm();

        // Assert: Should show username required error
        const errors = await loginPage.getErrorMessages();
        expect(errors.some(error =>
            error.toLowerCase().includes('username') &&
            error.toLowerCase().includes('required')
        )).toBeTruthy();

        // Should stay on login page
        expect(loginPage.getCurrentUrl()).toContain('/login');
    });

    // =========================================
    // TEST CASE 3: Empty Password Validation
    // =========================================
    test('TC003 - Should show error when password is empty', async () => {
        // Arrange: Only username filled
        await loginPage.fillFields({
            username: 'testuser',
            password: ''
        });

        // Act: Submit form
        await loginPage.submitForm();

        // Assert: Should show password required error
        const errors = await loginPage.getErrorMessages();
        expect(errors.some(error =>
            error.toLowerCase().includes('password') &&
            error.toLowerCase().includes('required')
        )).toBeTruthy();

        // Should stay on login page
        expect(loginPage.getCurrentUrl()).toContain('/login');
    });

    // =========================================
    // TEST CASE 4: Empty Form Submission
    // =========================================
    test('TC004 - Should show errors when submitting empty form', async () => {
        // Act: Submit empty form
        await loginPage.submitForm();

        // Assert: Should show both validation errors
        const errors = await loginPage.getErrorMessages();

        // Should have at least 2 errors (username and password)
        expect(errors.length).toBeGreaterThanOrEqual(2);

        // Check for username error
        expect(errors.some(error =>
            error.toLowerCase().includes('username')
        )).toBeTruthy();

        // Check for password error
        expect(errors.some(error =>
            error.toLowerCase().includes('password')
        )).toBeTruthy();

        // Should stay on login page
        expect(loginPage.getCurrentUrl()).toContain('/login');
    });

    // =========================================
    // TEST CASE 5: Password Visibility Toggle
    // =========================================
    test('TC005 - Should toggle password visibility', async () => {
        // Arrange: Fill password field
        await loginPage.fillFields({ password: 'SecurePass123!' });

        // Assert: Password should be hidden by default
        let inputType = await loginPage.getPasswordInputType();
        expect(inputType).toBe('password');

        // Act: Toggle visibility
        await loginPage.togglePasswordVisibility();

        // Assert: Password should now be visible
        inputType = await loginPage.getPasswordInputType();
        expect(inputType).toBe('text');

        // Act: Toggle visibility again
        await loginPage.togglePasswordVisibility();

        // Assert: Password should be hidden again
        inputType = await loginPage.getPasswordInputType();
        expect(inputType).toBe('password');
    });

    // =========================================
    // TEST CASE 6: Remember Me Checkbox
    // =========================================
    test('TC006 - Should toggle Remember Me checkbox', async () => {
        // Assert: Checkbox should be unchecked by default
        let isChecked = await loginPage.isRememberMeChecked();
        expect(isChecked).toBe(false);

        // Act: Click Remember Me checkbox
        await loginPage.toggleRememberMe();

        // Assert: Checkbox should now be checked
        isChecked = await loginPage.isRememberMeChecked();
        expect(isChecked).toBe(true);

        // Act: Click again to uncheck
        await loginPage.toggleRememberMe();

        // Assert: Checkbox should be unchecked again
        isChecked = await loginPage.isRememberMeChecked();
        expect(isChecked).toBe(false);
    });

    // =========================================
    // TEST CASE 7: Reset Button Functionality
    // =========================================
    test('TC007 - Should clear form fields when Reset is clicked', async () => {
        // Arrange: Fill all fields
        await loginPage.fillLoginForm('testuser', 'SecurePass123!');

        // Verify fields are filled
        let isEmpty = await loginPage.areAllFieldsEmpty();
        expect(isEmpty).toBe(false);

        // Act: Click Reset button
        await loginPage.resetForm();

        // Assert: All fields should be empty
        isEmpty = await loginPage.areAllFieldsEmpty();
        expect(isEmpty).toBe(true);
    });

    // =========================================
    // TEST CASE 8: Navigation to Register Page
    // =========================================
    test('TC008 - Should navigate to Register page from Login page', async ({ page }) => {
        // Act: Click Register link
        await loginPage.goToRegister();

        // Assert: Should be on register page
        await expect(page).toHaveURL(/.*\/register/);
    });

    // =========================================
    // TEST CASE 9: Login with Special Characters
    // =========================================
    test('TC009 - Should handle special characters in credentials', async ({ page }) => {
        // Arrange: Credentials with special characters
        const { username, password } = specialCharacterCredentials;

        // Act: Fill form and submit
        await loginPage.fillLoginForm(username, password);
        await loginPage.submitForm();

        // Assert: Should handle gracefully (login works or shows error, app doesn't crash)
        // Wait for either account page redirect or stay on login page
        await page.waitForTimeout(1000);

        // Verify the page doesn't crash and is still functional
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/(account|login)/);
    });

    // =========================================
    // TEST CASE 10: Login Form Accessibility
    // =========================================
    test('TC010 - Should have proper form field attributes for accessibility', async () => {
        // Assert: Username input should have proper attributes
        await expect(loginPage.usernameInput).toHaveAttribute('id', 'username');

        // Assert: Password input should have proper attributes
        await expect(loginPage.passwordInput).toHaveAttribute('id', 'password');
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

        // Assert: Login button should be visible and enabled
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.loginButton).toBeEnabled();
    });
});
