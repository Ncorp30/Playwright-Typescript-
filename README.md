# Playwright TypeScript Automation Framework

A production-ready, enterprise-grade Playwright automation framework using TypeScript for testing web applications.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running Tests](#running-tests)
- [Viewing Reports](#viewing-reports)
- [Framework Architecture](#framework-architecture)
- [Test Cases](#test-cases)
- [Best Practices](#best-practices)

## 📁 Project Structure

```
playwright-typescript-framework/
├── tests/
│   └── register.spec.ts          # Test cases (8 automation challenges)
├── pages/
│   └── RegisterPage.ts           # Page Object Model class
├── test-data/
│   └── registerData.ts           # Test data with TypeScript types
├── utils/
│   └── helpers.ts                # Utility functions
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
└── README.md                     # This file
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## ▶️ Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run specific test file
```bash
npm run test:register
```

### Run with specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 Viewing Reports

After running tests, view the HTML report:

```bash
npm run report
```

This opens an interactive HTML report in your browser showing:
- Test results
- Screenshots on failure
- Execution timeline
- Error details

## 🏗️ Framework Architecture

### Page Object Model (POM)

The framework follows the Page Object Model pattern for:
- **Maintainability**: Locators defined once, used everywhere
- **Readability**: Descriptive method names
- **Reusability**: Common actions in reusable methods

### RegisterPage Class

```typescript
// pages/RegisterPage.ts
export class RegisterPage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  // ... more locators

  async fillRegistrationForm(username, email, password, confirmPassword) {
    // Reusable action
  }
}
```

### Test Data Management

Test data is centralized with TypeScript interfaces:

```typescript
// test-data/registerData.ts
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

## ✅ Test Cases

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | Successful Registration | Valid data registration flow |
| 2 | Empty Fields Validation | Error messages for empty fields |
| 3 | Invalid Email Format | Email validation error |
| 4 | Mismatched Passwords | Password mismatch detection |
| 5 | Password Length Requirement | Minimum length validation |
| 6 | Password Visibility Toggle | Eye icon toggle functionality |
| 7 | Successful Redirect | Post-registration redirect |
| 8 | Form Reset Functionality | Reset button clears fields |

## 💡 Best Practices

### 1. Arrange-Act-Assert Pattern
All tests follow the AAA pattern:
```typescript
test('example', async () => {
  // Arrange - Setup test data
  const data = { ... };
  
  // Act - Perform action
  await page.click('button');
  
  // Assert - Verify outcome
  expect(result).toBe(expected);
});
```

### 2. Meaningful Test Names
Tests use descriptive names that explain what they validate.

### 3. No Hardcoded Waits
Use Playwright's auto-waiting and explicit wait conditions instead of `sleep()`.

### 4. Locator Best Practices
- Use `id` selectors when available
- Use `data-testid` for testing hooks
- Avoid fragile XPath selectors

### 5. Test Independence
Each test is independent and doesn't rely on other tests.

## 🔧 Configuration

### Playwright Config Highlights

- **HTML Reporter**: Detailed test reports
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Retries**: 1 retry on failure (2 on CI)
- **Timeout**: 60 seconds per test

### TypeScript Config

- Strict type checking enabled
- ES2020 target for modern JavaScript features
- Path aliases for cleaner imports

## 📝 License

ISC
