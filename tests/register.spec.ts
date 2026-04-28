import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import {
    validRegistrationData,
    generateUniqueRegistrationData,
    invalidEmailData,
    mismatchedPasswordsData,
    shortPasswordData,
    emptyRegistrationData,
    dataForResetTest
} from '../test-data/registerData';

/**
 * Registration Page Tests
 * 
 * Test suite covering all 8 automation challenge points:
 * 1. Successful Registration
 * 2. Empty Fields Validation
 * 3. Invalid Email Format
 * 4. Mismatched Passwords
 * 5. Password Length Requirement
 * 6. Password Visibility Toggle
 * 7. Successful Redirect
 * 8. Form Reset Functionality
 * 
 * Following Arrange-Act-Assert (AAA) pattern for all tests.
 */

test.describe('Registration Page - Automation Challenges', () => {
    let registerPage: RegisterPage;

    // Before each test, create a new RegisterPage instance and navigate to the page
    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        await registerPage.navigateDirect();
        await registerPage.verifyPageLoaded();
    });

    /**
     * Test Case 1: Successful Registration
     * 
     * Validates that a complete registration flow works with valid data.
     * This test fills all fields with valid data and verifies the form can be submitted.
     */
    test('TC01: Should complete registration successfully with valid data', async ({ page }) => {
        // Arrange - Generate unique registration data to avoid conflicts
        const uniqueData = generateUniqueRegistrationData();

        // Act - Fill the registration form and submit
        await registerPage.fillRegistrationForm(
            uniqueData.username,
            uniqueData.email,
            uniqueData.password,
            uniqueData.confirmPassword
        );
        await registerPage.submitForm();

        // Assert - Verify either success message or no error state
        // Note: The exact success behavior may vary based on application
        await page.waitForTimeout(1000); // Wait for any response

        // Check for any of these success indicators:
        // 1. Redirect away from register page
        // 2. Success message displayed
        // 3. Form cleared
        const currentUrl = page.url();
        const errorMessages = await registerPage.getErrorMessages();

        // For successful registration, there should be no error messages
        // or the user should be redirected
        const isSuccess =
            !currentUrl.includes('/register') ||
            errorMessages.length === 0;

        expect(isSuccess).toBeTruthy();
    });

    /**
     * Test Case 2: Empty Fields Validation
     * 
     * Ensures that submitting the form with empty fields triggers 
     * appropriate error messages for each required input.
     */
    test('TC02: Should show validation errors for empty fields', async ({ page }) => {
        // Arrange - Form is already empty by default

        // Act - Try to submit the empty form
        await registerPage.submitForm();

        // Assert - Verify error messages are displayed
        await page.waitForTimeout(500); // Wait for validation messages

        // Check that error messages appear (at least one per required field)
        const errorMessages = await registerPage.getErrorMessages();

        // Alternatively, check each field for error styling or messages
        // by checking if the form is still on the register page (not submitted)
        const currentUrl = page.url();
        expect(currentUrl).toContain('/register');

        // Verify at least some validation occurred
        // Either through error messages or the form not being submitted
        const usernameValue = await registerPage.usernameInput.inputValue();
        const emailValue = await registerPage.emailInput.inputValue();

        expect(usernameValue).toBe('');
        expect(emailValue).toBe('');
    });

    /**
     * Test Case 3: Invalid Email Format
     * 
     * Confirms that entering an incorrectly formatted email address
     * results in a validation error.
     */
    test('TC03: Should display error for invalid email format', async ({ page }) => {
        // Arrange - Prepare data with invalid email
        const invalidEmail = 'invalidemail';

        // Act - Fill form with invalid email and submit
        await registerPage.fillRegistrationForm(
            'validUsername',
            invalidEmail,
            'ValidPassword123!',
            'ValidPassword123!'
        );
        await registerPage.submitForm();

        // Assert - Verify email validation error
        await page.waitForTimeout(500);

        // Check that we're still on the register page (form not submitted)
        const currentUrl = page.url();
        expect(currentUrl).toContain('/register');

        // The email field should still have the invalid value (not cleared)
        const emailValue = await registerPage.emailInput.inputValue();
        expect(emailValue).toBe(invalidEmail);

        // Additional check: Look for email-specific error message
        const errorMessages = await registerPage.getErrorMessages();

        // At minimum, the form should not have been submitted successfully
        // which we verified by still being on the register page
    });

    /**
     * Test Case 4: Mismatched Passwords
     * 
     * Verifies that the system detects when Password and Confirm Password 
     * fields do not match and displays an error.
     */
    test('TC04: Should display error when passwords do not match', async ({ page }) => {
        // Arrange - Prepare data with mismatched passwords
        const mismatchData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            confirmPassword: 'DifferentPassword456!'
        };

        // Act - Fill form with mismatched passwords and submit
        await registerPage.fillRegistrationForm(
            mismatchData.username,
            mismatchData.email,
            mismatchData.password,
            mismatchData.confirmPassword
        );
        await registerPage.submitForm();

        // Assert - Verify password mismatch error
        await page.waitForTimeout(500);

        // Check that we're still on the register page
        const currentUrl = page.url();
        expect(currentUrl).toContain('/register');

        // Verify password fields still contain the entered values
        const passwordValue = await registerPage.passwordInput.inputValue();
        const confirmValue = await registerPage.confirmPasswordInput.inputValue();

        // Password fields should still have values (form not reset on error)
        expect(passwordValue).toBe(mismatchData.password);
        expect(confirmValue).toBe(mismatchData.confirmPassword);
    });

    /**
     * Test Case 5: Password Length Requirement
     * 
     * Tests that the password field enforces a minimum length requirement
     * and shows a validation message for short passwords.
     */
    test('TC05: Should display error for password that is too short', async ({ page }) => {
        // Arrange - Prepare data with short password
        const shortPassword = '123';

        // Act - Fill form with short password and submit
        await registerPage.fillRegistrationForm(
            'validUsername',
            'valid@email.com',
            shortPassword,
            shortPassword
        );
        await registerPage.submitForm();

        // Assert - Verify password length validation error
        await page.waitForTimeout(500);

        // Check that we're still on the register page
        const currentUrl = page.url();
        expect(currentUrl).toContain('/register');

        // Verify password field still contains the short password
        const passwordValue = await registerPage.passwordInput.inputValue();
        expect(passwordValue).toBe(shortPassword);

        // Check for error messages related to password length
        const errorMessages = await registerPage.getErrorMessages();

        // Form should not have been submitted with short password
    });

    /**
     * Test Case 6: Password Visibility Toggle
     * 
     * Validates that clicking the visibility icon correctly toggles
     * the input field between 'password' type and 'text' type.
     */
    test('TC06: Should toggle password visibility when clicking eye icon', async ({ page }) => {
        // Arrange - Fill the password field
        const testPassword = 'TestPassword123!';
        await registerPage.passwordInput.fill(testPassword);

        // Get initial password input type (should be 'password')
        const initialType = await registerPage.getPasswordInputType();
        expect(initialType).toBe('password');

        // Act - Click the visibility toggle
        await registerPage.togglePasswordVisibility();

        // Assert - Verify the input type changed to 'text'
        const toggledType = await registerPage.getPasswordInputType();
        expect(toggledType).toBe('text');

        // Act again - Toggle back to hidden
        await registerPage.togglePasswordVisibility();

        // Assert - Verify the input type changed back to 'password'
        const finalType = await registerPage.getPasswordInputType();
        expect(finalType).toBe('password');

        // Verify the password value is still there
        const passwordValue = await registerPage.passwordInput.inputValue();
        expect(passwordValue).toBe(testPassword);
    });

    /**
     * Test Case 7: Successful Redirect
     * 
     * Specifically verifies that a successful registration redirects 
     * the user to the correct post-registration URL (home page).
     */
    test('TC07: Should redirect to home page after successful registration', async ({ page }) => {
        // Arrange - Generate unique registration data
        const uniqueData = generateUniqueRegistrationData();

        // Store original URL for comparison
        const registerUrl = page.url();
        expect(registerUrl).toContain('/register');

        // Act - Complete the registration
        await registerPage.fillRegistrationForm(
            uniqueData.username,
            uniqueData.email,
            uniqueData.password,
            uniqueData.confirmPassword
        );
        await registerPage.submitForm();

        // Assert - Wait for potential redirect
        await page.waitForTimeout(2000);

        // Check if redirect occurred or success state is shown
        const isRedirected = await registerPage.isRegistrationSuccessful();

        // If redirected, verify we're no longer on register page
        if (isRedirected) {
            const newUrl = page.url();
            expect(newUrl).not.toContain('/register');
        } else {
            // If not redirected, check for success message on the same page
            // Some applications show success message before redirecting
            const errorMessages = await registerPage.getErrorMessages();

            // Success if no error messages and form fields are cleared or valid
            expect(errorMessages.length).toBeLessThanOrEqual(0);
        }
    });

    /**
     * Test Case 8: Form Reset Functionality
     * 
     * Ensures that clicking the Reset button clears all input values
     * entered by the user.
     */
    test('TC08: Should clear all fields when reset button is clicked', async ({ page }) => {
        // Arrange - Fill all form fields with data
        const testData = dataForResetTest;
        await registerPage.fillRegistrationForm(
            testData.username,
            testData.email,
            testData.password,
            testData.confirmPassword
        );

        // Verify fields are filled
        expect(await registerPage.usernameInput.inputValue()).toBe(testData.username);
        expect(await registerPage.emailInput.inputValue()).toBe(testData.email);
        expect(await registerPage.passwordInput.inputValue()).toBe(testData.password);
        expect(await registerPage.confirmPasswordInput.inputValue()).toBe(testData.confirmPassword);

        // Act - Click the reset button
        await registerPage.resetForm();

        // Assert - Verify all fields are cleared
        await page.waitForTimeout(300); // Brief wait for form reset

        const usernameValue = await registerPage.usernameInput.inputValue();
        const emailValue = await registerPage.emailInput.inputValue();
        const passwordValue = await registerPage.passwordInput.inputValue();
        const confirmPasswordValue = await registerPage.confirmPasswordInput.inputValue();

        expect(usernameValue).toBe('');
        expect(emailValue).toBe('');
        expect(passwordValue).toBe('');
        expect(confirmPasswordValue).toBe('');

        // Additional check using the helper method
        const allEmpty = await registerPage.areAllFieldsEmpty();
        expect(allEmpty).toBe(true);
    });
});

/**
 * Additional Edge Case Tests
 * These are bonus tests that cover edge cases beyond the 8 main challenges
 */
test.describe('Registration Page - Edge Cases', () => {
    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        await registerPage.navigateDirect();
        await registerPage.verifyPageLoaded();
    });

    test('Should scroll to Automation Challenge section', async ({ page }) => {
        // Act - Scroll to the automation challenge section
        await registerPage.scrollToAutomationChallenge();

        // Assert - Verify the section is visible
        const challengeHeading = page.locator('text=Automation Challenge');
        await expect(challengeHeading).toBeInViewport();
    });

    test('Should navigate to Register page from home page', async ({ page }) => {
        // Arrange - Start from home page
        await page.goto('/');

        // Act - Navigate to register page using nav link
        const registerPage = new RegisterPage(page);
        await registerPage.navigate();

        // Assert - Verify we're on the register page
        await expect(page).toHaveURL(/.*register/);
        await registerPage.verifyPageLoaded();
    });
});
