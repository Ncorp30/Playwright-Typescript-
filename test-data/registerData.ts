/**
 * Test Data for Registration Tests
 * 
 * This file contains all test data used in registration tests.
 * Using TypeScript interfaces for type safety.
 */

// =========================================
// INTERFACES - Type definitions
// =========================================

/**
 * Interface for registration form data
 */
export interface RegistrationData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

/**
 * Interface for partial registration data (some fields may be empty)
 */
export interface PartialRegistrationData {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

// =========================================
// VALID TEST DATA
// =========================================

/**
 * Valid registration data for successful registration test
 */
export const validRegistrationData: RegistrationData = {
    username: 'testuser123',
    email: 'testuser@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
};

/**
 * Generate unique valid registration data
 * Useful for tests that need unique users
 */
export function generateUniqueRegistrationData(): RegistrationData {
    const timestamp = Date.now();
    return {
        username: `user_${timestamp}`,
        email: `user_${timestamp}@example.com`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
    };
}

// =========================================
// INVALID EMAIL TEST DATA
// =========================================

/**
 * Invalid email formats for email validation testing
 */
export const invalidEmails: string[] = [
    'invalidemail',           // Missing @ and domain
    'invalid@',               // Missing domain
    '@nodomain.com',          // Missing local part
    'invalid@domain',         // Missing TLD
    'invalid.email@',         // Missing domain after @
    'spaces in@email.com',    // Contains spaces
];

/**
 * Registration data with invalid email
 */
export const invalidEmailData: RegistrationData = {
    username: 'testuser',
    email: 'invalidemail',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
};

// =========================================
// PASSWORD MISMATCH TEST DATA
// =========================================

/**
 * Registration data with mismatched passwords
 */
export const mismatchedPasswordsData: RegistrationData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    confirmPassword: 'DifferentPassword456!'
};

// =========================================
// SHORT PASSWORD TEST DATA
// =========================================

/**
 * Registration data with password that's too short
 */
export const shortPasswordData: RegistrationData = {
    username: 'testuser',
    email: 'test@example.com',
    password: '123',
    confirmPassword: '123'
};

/**
 * Various short passwords for testing
 */
export const shortPasswords: string[] = [
    'a',          // 1 character
    'ab',         // 2 characters
    '123',        // 3 characters
    'pass',       // 4 characters
    '12345',      // 5 characters
];

// =========================================
// EMPTY FIELDS TEST DATA
// =========================================

/**
 * Empty registration data for validation testing
 */
export const emptyRegistrationData: RegistrationData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
};

/**
 * Partial data scenarios for testing individual field validation
 */
export const partialDataScenarios: PartialRegistrationData[] = [
    { username: 'user', email: '', password: '', confirmPassword: '' },
    { username: '', email: 'test@example.com', password: '', confirmPassword: '' },
    { username: '', email: '', password: 'Password123!', confirmPassword: '' },
    { username: '', email: '', password: '', confirmPassword: 'Password123!' },
];

// =========================================
// FORM RESET TEST DATA
// =========================================

/**
 * Data to fill before testing reset functionality
 */
export const dataForResetTest: RegistrationData = {
    username: 'resetTestUser',
    email: 'reset@test.com',
    password: 'ResetPassword123!',
    confirmPassword: 'ResetPassword123!'
};

// =========================================
// ERROR MESSAGES (Expected)
// =========================================

/**
 * Expected error messages for validation
 * Note: These may need adjustment based on actual application messages
 */
export const expectedErrors = {
    emptyUsername: 'Username is required',
    emptyEmail: 'Email is required',
    emptyPassword: 'Password is required',
    emptyConfirmPassword: 'Please confirm your password',
    invalidEmail: 'Please enter a valid email',
    passwordMismatch: 'Passwords do not match',
    shortPassword: 'Password must be at least',
};
