/**
 * Test Data for Login Tests
 * 
 * This file contains all test data used in login tests.
 * Using TypeScript interfaces for type safety.
 */

// =========================================
// INTERFACES - Type definitions
// =========================================

/**
 * Interface for login credentials
 */
export interface LoginCredentials {
    username: string;
    password: string;
}

/**
 * Interface for partial login data (some fields may be empty)
 */
export interface PartialLoginCredentials {
    username?: string;
    password?: string;
}

/**
 * Interface for data-driven test scenarios
 */
export interface LoginTestScenario {
    testId: string;
    description: string;
    username: string;
    password: string;
    expectedOutcome: 'success' | 'error';
    expectedError?: string;
}

/**
 * Interface for validation test scenarios
 */
export interface ValidationTestScenario {
    testId: string;
    description: string;
    username: string;
    password: string;
    expectedErrors: string[];
}

// =========================================
// VALID TEST DATA
// =========================================

/**
 * Valid login credentials for successful login test
 * Note: The application accepts any non-empty credentials
 */
export const validLoginCredentials: LoginCredentials = {
    username: 'testuser',
    password: 'SecurePass123!'
};

/**
 * Generate unique login credentials
 * Useful for tests that need unique users
 */
export function generateUniqueLoginCredentials(): LoginCredentials {
    const timestamp = Date.now();
    return {
        username: `user_${timestamp}`,
        password: 'SecurePass123!'
    };
}

// =========================================
// EMPTY FIELDS TEST DATA
// =========================================

/**
 * Empty login credentials for validation testing
 */
export const emptyLoginCredentials: LoginCredentials = {
    username: '',
    password: ''
};

/**
 * Login with only username filled
 */
export const usernameOnlyCredentials: PartialLoginCredentials = {
    username: 'testuser',
    password: ''
};

/**
 * Login with only password filled
 */
export const passwordOnlyCredentials: PartialLoginCredentials = {
    username: '',
    password: 'SecurePass123!'
};

// =========================================
// INVALID TEST DATA
// =========================================

/**
 * Invalid username scenarios
 */
export const invalidUsernameCredentials: LoginCredentials = {
    username: 'a',  // Very short username
    password: 'SecurePass123!'
};

/**
 * Various usernames for testing
 */
export const testUsernames: string[] = [
    'admin',
    'testuser',
    'user@example.com',
    'user_123',
    'guest'
];

/**
 * Various passwords for testing
 */
export const testPasswords: string[] = [
    'password',
    'Password123!',
    'SecurePass@2024',
    'admin123',
    'test'
];

// =========================================
// SPECIAL CHARACTERS TEST DATA
// =========================================

/**
 * Credentials with special characters
 */
export const specialCharacterCredentials: LoginCredentials = {
    username: 'test<script>alert(1)</script>',
    password: '<script>alert(1)</script>'
};

/**
 * Credentials with SQL injection attempt
 */
export const sqlInjectionCredentials: LoginCredentials = {
    username: "admin' OR '1'='1",
    password: "' OR '1'='1"
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
    emptyPassword: 'Password is required',
    invalidCredentials: 'Invalid credentials',
    accountLocked: 'Account is locked',
    tooManyAttempts: 'Too many login attempts'
};

// =========================================
// REMEMBER ME TEST DATA
// =========================================

/**
 * Credentials for remember me functionality testing
 */
export const rememberMeCredentials: LoginCredentials = {
    username: 'remember_me_user',
    password: 'RememberPass123!'
};

// =========================================
// DATA-DRIVEN TEST SCENARIOS
// =========================================

/**
 * Valid Login Scenarios - All should result in successful login
 * Used with test.each() for parameterized testing
 */
export const validLoginScenarios: LoginTestScenario[] = [
    {
        testId: 'VL001',
        description: 'Standard alphanumeric username',
        username: 'testuser123',
        password: 'Password123!',
        expectedOutcome: 'success'
    },
    {
        testId: 'VL002',
        description: 'Email format username',
        username: 'user@example.com',
        password: 'SecurePass@2024',
        expectedOutcome: 'success'
    },
    {
        testId: 'VL003',
        description: 'Username with underscore',
        username: 'test_user_01',
        password: 'MyPassword#1',
        expectedOutcome: 'success'
    },
    {
        testId: 'VL004',
        description: 'Short valid credentials',
        username: 'admin',
        password: 'admin123',
        expectedOutcome: 'success'
    },
    {
        testId: 'VL005',
        description: 'Username with numbers',
        username: 'user2024',
        password: 'Pass2024!',
        expectedOutcome: 'success'
    }
];

/**
 * Validation Error Scenarios - All should show validation errors
 * Used with test.each() for parameterized testing
 */
export const validationErrorScenarios: ValidationTestScenario[] = [
    {
        testId: 'VE001',
        description: 'Both fields empty',
        username: '',
        password: '',
        expectedErrors: ['Username is required', 'Password is required']
    },
    {
        testId: 'VE002',
        description: 'Empty username only',
        username: '',
        password: 'ValidPassword123!',
        expectedErrors: ['Username is required']
    },
    {
        testId: 'VE003',
        description: 'Empty password only',
        username: 'validuser',
        password: '',
        expectedErrors: ['Password is required']
    }
];

/**
 * Special Character Scenarios - Test app handling of special inputs
 * Used with test.each() for parameterized testing
 */
export const specialCharacterScenarios: LoginTestScenario[] = [
    {
        testId: 'SC001',
        description: 'XSS attempt in username',
        username: '<script>alert("xss")</script>',
        password: 'ValidPassword123!',
        expectedOutcome: 'success'
    },
    {
        testId: 'SC002',
        description: 'SQL injection attempt',
        username: "admin' OR '1'='1",
        password: "' OR '1'='1",
        expectedOutcome: 'success'
    },
    {
        testId: 'SC003',
        description: 'Unicode characters',
        username: 'user_日本語',
        password: 'パスワード123',
        expectedOutcome: 'success'
    },
    {
        testId: 'SC004',
        description: 'Special symbols in password',
        username: 'normaluser',
        password: 'P@$$w0rd!#%&*()[]{}',
        expectedOutcome: 'success'
    },
    {
        testId: 'SC005',
        description: 'HTML entities',
        username: '&lt;user&gt;',
        password: '&amp;password&amp;',
        expectedOutcome: 'success'
    }
];

/**
 * Boundary Test Scenarios - Test edge cases
 * Used with test.each() for parameterized testing
 */
export const boundaryTestScenarios: LoginTestScenario[] = [
    {
        testId: 'BT001',
        description: 'Minimum length credentials (1 char each)',
        username: 'a',
        password: 'b',
        expectedOutcome: 'success'
    },
    {
        testId: 'BT002',
        description: 'Very long username (100 chars)',
        username: 'a'.repeat(100),
        password: 'ValidPassword123!',
        expectedOutcome: 'success'
    },
    {
        testId: 'BT003',
        description: 'Very long password (100 chars)',
        username: 'normaluser',
        password: 'P'.repeat(95) + 'ass1!',
        expectedOutcome: 'success'
    },
    {
        testId: 'BT004',
        description: 'Username with leading spaces',
        username: '   spaceduser',
        password: 'ValidPassword123!',
        expectedOutcome: 'success'
    },
    {
        testId: 'BT005',
        description: 'Password with trailing spaces',
        username: 'normaluser',
        password: 'ValidPassword123!   ',
        expectedOutcome: 'success'
    }
];

/**
 * Combined test data for comprehensive data-driven testing
 */
export const allLoginScenarios = {
    valid: validLoginScenarios,
    validation: validationErrorScenarios,
    specialChars: specialCharacterScenarios,
    boundary: boundaryTestScenarios
};
