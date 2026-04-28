/**
 * Script to generate the login test data Excel file
 * Run this with: npx ts-node test-data/generateExcel.ts
 */

import * as XLSX from 'xlsx';
import * as path from 'path';

// Define the test data
const validLoginScenarios = [
    { testId: 'VL001', description: 'Standard alphanumeric username', username: 'testuser123', password: 'Password123!', expectedOutcome: 'success', expectedError: '' },
    { testId: 'VL002', description: 'Email format username', username: 'user@example.com', password: 'SecurePass@2024', expectedOutcome: 'success', expectedError: '' },
    { testId: 'VL003', description: 'Username with underscore', username: 'test_user_01', password: 'MyPassword#1', expectedOutcome: 'success', expectedError: '' },
    { testId: 'VL004', description: 'Short valid credentials', username: 'admin', password: 'admin123', expectedOutcome: 'success', expectedError: '' },
    { testId: 'VL005', description: 'Username with numbers', username: 'user2024', password: 'Pass2024!', expectedOutcome: 'success', expectedError: '' },
    { testId: 'VL006', description: 'Complex password', username: 'secureuser', password: 'C0mpl3x@Pass!#', expectedOutcome: 'success', expectedError: '' },
];

const validationErrorScenarios = [
    { testId: 'VE001', description: 'Both fields empty', username: '', password: '', expectedOutcome: 'error', expectedError: 'Username is required' },
    { testId: 'VE002', description: 'Empty username only', username: '', password: 'ValidPassword123!', expectedOutcome: 'error', expectedError: 'Username is required' },
    { testId: 'VE003', description: 'Empty password only', username: 'validuser', password: '', expectedOutcome: 'error', expectedError: 'Password is required' },
];

const specialCharacterScenarios = [
    { testId: 'SC001', description: 'XSS attempt in username', username: '<script>alert("xss")</script>', password: 'ValidPassword123!', expectedOutcome: 'success', expectedError: '' },
    { testId: 'SC002', description: 'SQL injection attempt', username: "admin' OR '1'='1", password: "' OR '1'='1", expectedOutcome: 'success', expectedError: '' },
    { testId: 'SC003', description: 'Unicode characters', username: 'user_テスト', password: 'パスワード123', expectedOutcome: 'success', expectedError: '' },
    { testId: 'SC004', description: 'Special symbols in password', username: 'normaluser', password: 'P@$$w0rd!#%&*()', expectedOutcome: 'success', expectedError: '' },
];

const boundaryTestScenarios = [
    { testId: 'BT001', description: 'Minimum length credentials', username: 'ab', password: 'cd', expectedOutcome: 'success', expectedError: '' },
    { testId: 'BT002', description: 'Very long username (50 chars)', username: 'a'.repeat(50), password: 'ValidPassword123!', expectedOutcome: 'success', expectedError: '' },
    { testId: 'BT003', description: 'Username with leading spaces', username: '   spaceduser', password: 'ValidPassword123!', expectedOutcome: 'success', expectedError: '' },
    { testId: 'BT004', description: 'Password with trailing spaces', username: 'normaluser', password: 'ValidPassword123!   ', expectedOutcome: 'success', expectedError: '' },
];

// Create workbook
const workbook = XLSX.utils.book_new();

// Add sheets
const validSheet = XLSX.utils.json_to_sheet(validLoginScenarios);
const validationSheet = XLSX.utils.json_to_sheet(validationErrorScenarios);
const specialSheet = XLSX.utils.json_to_sheet(specialCharacterScenarios);
const boundarySheet = XLSX.utils.json_to_sheet(boundaryTestScenarios);

// Set column widths for better readability
const setColumnWidths = (sheet: XLSX.WorkSheet) => {
    sheet['!cols'] = [
        { wch: 8 },   // testId
        { wch: 35 },  // description
        { wch: 30 },  // username
        { wch: 25 },  // password
        { wch: 15 },  // expectedOutcome
        { wch: 25 },  // expectedError
    ];
};

setColumnWidths(validSheet);
setColumnWidths(validationSheet);
setColumnWidths(specialSheet);
setColumnWidths(boundarySheet);

XLSX.utils.book_append_sheet(workbook, validSheet, 'ValidLogins');
XLSX.utils.book_append_sheet(workbook, validationSheet, 'ValidationErrors');
XLSX.utils.book_append_sheet(workbook, specialSheet, 'SpecialCharacters');
XLSX.utils.book_append_sheet(workbook, boundarySheet, 'BoundaryTests');

// Write the file
const outputPath = path.join(__dirname, 'loginTestData.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Excel file created at: ${outputPath}`);
console.log('\nSheets created:');
console.log('- ValidLogins: ' + validLoginScenarios.length + ' test cases');
console.log('- ValidationErrors: ' + validationErrorScenarios.length + ' test cases');
console.log('- SpecialCharacters: ' + specialCharacterScenarios.length + ' test cases');
console.log('- BoundaryTests: ' + boundaryTestScenarios.length + ' test cases');
console.log('\nTotal: ' + (validLoginScenarios.length + validationErrorScenarios.length + specialCharacterScenarios.length + boundaryTestScenarios.length) + ' test cases');
