import * as XLSX from 'xlsx';
import * as path from 'path';

/**
 * Excel Data Reader Utility
 * 
 * This utility provides functions to read test data from Excel files.
 * Supports multiple sheets and dynamic column mapping.
 */

export interface ExcelRow {
    [key: string]: string | number | boolean | undefined;
}

/**
 * Read data from an Excel file
 * @param filePath - Path to the Excel file
 * @param sheetName - Name of the sheet to read (defaults to first sheet)
 * @returns Array of objects representing rows
 */
export function readExcelFile(filePath: string, sheetName?: string): ExcelRow[] {
    const absolutePath = path.resolve(filePath);
    const workbook = XLSX.readFile(absolutePath);

    // Use specified sheet or first sheet
    const sheet = sheetName
        ? workbook.Sheets[sheetName]
        : workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found in workbook`);
    }

    // Convert to JSON with header row as keys
    const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet);
    return data;
}

/**
 * Read all sheets from an Excel file
 * @param filePath - Path to the Excel file
 * @returns Object with sheet names as keys and data arrays as values
 */
export function readAllSheets(filePath: string): { [sheetName: string]: ExcelRow[] } {
    const absolutePath = path.resolve(filePath);
    const workbook = XLSX.readFile(absolutePath);

    const result: { [sheetName: string]: ExcelRow[] } = {};

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        result[sheetName] = XLSX.utils.sheet_to_json<ExcelRow>(sheet);
    }

    return result;
}

/**
 * Get sheet names from an Excel file
 * @param filePath - Path to the Excel file
 * @returns Array of sheet names
 */
export function getSheetNames(filePath: string): string[] {
    const absolutePath = path.resolve(filePath);
    const workbook = XLSX.readFile(absolutePath);
    return workbook.SheetNames;
}

/**
 * Read Excel file with type conversion
 * @param filePath - Path to the Excel file
 * @param sheetName - Name of the sheet to read
 * @returns Typed array of login test data
 */
export interface LoginExcelData {
    testId: string;
    description: string;
    username: string;
    password: string;
    expectedOutcome: 'success' | 'error';
    expectedError?: string;
}

export function readLoginTestData(filePath: string, sheetName?: string): LoginExcelData[] {
    const rawData = readExcelFile(filePath, sheetName);

    return rawData.map(row => ({
        testId: String(row.testId || row.TestId || row.test_id || ''),
        description: String(row.description || row.Description || ''),
        username: String(row.username || row.Username || ''),
        password: String(row.password || row.Password || ''),
        expectedOutcome: (String(row.expectedOutcome || row.ExpectedOutcome || 'success').toLowerCase()) as 'success' | 'error',
        expectedError: row.expectedError ? String(row.expectedError) : undefined
    }));
}

/**
 * Create a sample Excel file with login test data
 * Useful for generating template files
 */
export function createSampleExcelFile(filePath: string): void {
    const workbook = XLSX.utils.book_new();

    // Valid Login Scenarios
    const validLogins = [
        { testId: 'VL001', description: 'Standard alphanumeric username', username: 'testuser123', password: 'Password123!', expectedOutcome: 'success' },
        { testId: 'VL002', description: 'Email format username', username: 'user@example.com', password: 'SecurePass@2024', expectedOutcome: 'success' },
        { testId: 'VL003', description: 'Username with underscore', username: 'test_user_01', password: 'MyPassword#1', expectedOutcome: 'success' },
    ];

    // Validation Error Scenarios
    const validationErrors = [
        { testId: 'VE001', description: 'Both fields empty', username: '', password: '', expectedOutcome: 'error', expectedError: 'Username is required' },
        { testId: 'VE002', description: 'Empty username only', username: '', password: 'ValidPassword123!', expectedOutcome: 'error', expectedError: 'Username is required' },
        { testId: 'VE003', description: 'Empty password only', username: 'validuser', password: '', expectedOutcome: 'error', expectedError: 'Password is required' },
    ];

    const validSheet = XLSX.utils.json_to_sheet(validLogins);
    const errorSheet = XLSX.utils.json_to_sheet(validationErrors);

    XLSX.utils.book_append_sheet(workbook, validSheet, 'ValidLogins');
    XLSX.utils.book_append_sheet(workbook, errorSheet, 'ValidationErrors');

    XLSX.writeFile(workbook, filePath);
}
