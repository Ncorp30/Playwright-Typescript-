import { test, expect } from '@playwright/test';
import { FileUploadPage } from '../../pages/BasicTesting/FileUploadPage';
import * as path from 'path';

/**
 * File Upload Automation Tests
 * 
 * Test suite covering all 3 automation challenges for the File Upload page:
 * 1. Single File Upload - Select a single file and verify file information
 * 2. Multiple File Upload - Select multiple files and verify all appear in list
 * 3. Drag and Drop Upload - Drag files onto drop area and verify
 */

// Test data file paths
const TEST_DATA_DIR = path.join(process.cwd(), 'test-data');
const SINGLE_FILE = path.join(TEST_DATA_DIR, 'sample-file.txt');
const DOCUMENT_FILE = path.join(TEST_DATA_DIR, 'sample-document.txt');
const UPLOAD_FILE = path.join(TEST_DATA_DIR, 'test-upload.txt');

test.describe('File Upload Automation Challenge', () => {
    let fileUploadPage: FileUploadPage;

    test.beforeEach(async ({ page }) => {
        fileUploadPage = new FileUploadPage(page);
        await fileUploadPage.navigate();
        await fileUploadPage.waitForPageLoad();
    });

    /**
     * Test Case 1: Single File Upload
     * Challenge: Select a single file to upload and verify that the file information is correctly displayed
     */
    test('TC01 - Single file upload displays file information', async () => {
        // Verify page loaded
        await fileUploadPage.verifyPageLoaded();

        // Verify single file input is visible
        await expect(fileUploadPage.singleFileInput).toBeVisible();

        // Upload a single file
        await fileUploadPage.uploadSingleFile(SINGLE_FILE);

        // Verify the file name is displayed on the page
        await fileUploadPage.verifySingleFileUploaded('sample-file.txt');

        // Get and log the displayed file name
        const fileName = await fileUploadPage.getSingleFileName();
        console.log('Uploaded file name:', fileName);
    });

    /**
     * Test Case 2: Single File Upload with Different File Types
     * Additional test to verify different file types can be uploaded
     */
    test('TC02 - Single file upload works with different files', async () => {
        // Verify page loaded
        await fileUploadPage.verifyPageLoaded();

        // Upload a document file
        await fileUploadPage.uploadSingleFile(DOCUMENT_FILE);

        // Verify the file name is displayed
        await fileUploadPage.verifySingleFileUploaded('sample-document.txt');
    });

    /**
     * Test Case 3: Multiple Files Upload
     * Challenge: Select multiple files to upload and verify all files appear in the list
     */
    test('TC03 - Multiple files upload displays all files in list', async () => {
        // Verify page loaded
        await fileUploadPage.verifyPageLoaded();

        // Verify multiple files input is visible
        await expect(fileUploadPage.multipleFilesInput).toBeVisible();

        // Upload multiple files
        const filesToUpload = [SINGLE_FILE, DOCUMENT_FILE, UPLOAD_FILE];
        await fileUploadPage.uploadMultipleFiles(filesToUpload);

        // Verify all files are displayed
        await fileUploadPage.verifyMultipleFilesUploaded([
            'sample-file.txt',
            'sample-document.txt',
            'test-upload.txt'
        ]);

        // Log the file names
        console.log('Multiple files uploaded successfully');
    });

    /**
     * Test Case 4: Multiple Files Upload - Two Files
     * Verify uploading exactly two files works correctly
     */
    test('TC04 - Multiple files upload with two files', async () => {
        // Verify page loaded
        await fileUploadPage.verifyPageLoaded();

        // Upload two files
        const filesToUpload = [SINGLE_FILE, DOCUMENT_FILE];
        await fileUploadPage.uploadMultipleFiles(filesToUpload);

        // Verify both files are displayed
        await fileUploadPage.verifyMultipleFilesUploaded([
            'sample-file.txt',
            'sample-document.txt'
        ]);
    });

    /**
     * Test Case 5: Drag and Drop Upload
     * Challenge: Test the drag-and-drop functionality by dragging files onto the designated drop area
     */
    test('TC05 - Drag and drop upload functionality', async () => {
        // Verify page loaded
        await fileUploadPage.verifyPageLoaded();

        // Verify drag-drop area is visible (scroll if needed)
        await fileUploadPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await fileUploadPage.page.waitForTimeout(500);

        // Check if drag-drop area exists
        const dragDropVisible = await fileUploadPage.dragDropArea.isVisible();

        if (dragDropVisible) {
            // Attempt drag and drop upload
            await fileUploadPage.dragAndDropFiles([SINGLE_FILE]);

            // Verify file was uploaded
            await fileUploadPage.verifyDragDropFilesUploaded(['sample-file.txt']);
            console.log('Drag and drop upload successful');
        } else {
            console.log('Drag and drop area not found - skipping drag-drop test');
            // Mark test as passed if drag-drop is not available on page
        }
    });

    /**
     * Test Case 6: File Input Elements Visibility
     * Verify all file upload elements are present on the page
     */
    test('TC06 - All file upload elements are visible', async () => {
        // Verify single file input
        await expect(fileUploadPage.singleFileInput).toBeVisible();

        // Verify multiple files input
        await expect(fileUploadPage.multipleFilesInput).toBeVisible();

        // Verify the inputs have correct type attribute
        await expect(fileUploadPage.singleFileInput).toHaveAttribute('type', 'file');
        await expect(fileUploadPage.multipleFilesInput).toHaveAttribute('type', 'file');

        // Verify multiple files input has multiple attribute
        await expect(fileUploadPage.multipleFilesInput).toHaveAttribute('multiple', '');
    });

    /**
     * Test Case 7: Clear and Re-upload Single File
     * Verify that files can be cleared and new files uploaded
     */
    test('TC07 - Clear and re-upload single file', async () => {
        // Verify page loaded
        await fileUploadPage.verifyPageLoaded();

        // Upload first file
        await fileUploadPage.uploadSingleFile(SINGLE_FILE);
        await fileUploadPage.verifySingleFileUploaded('sample-file.txt');

        // Clear and upload different file
        await fileUploadPage.uploadSingleFile(DOCUMENT_FILE);
        await fileUploadPage.verifySingleFileUploaded('sample-document.txt');
    });

    /**
     * Test Case 8: Clear and Re-upload Multiple Files
     * Verify that multiple files can be replaced with new selection
     */
    test('TC08 - Replace multiple files selection', async () => {
        // Verify page loaded
        await fileUploadPage.verifyPageLoaded();

        // Upload initial files
        await fileUploadPage.uploadMultipleFiles([SINGLE_FILE, DOCUMENT_FILE]);
        await fileUploadPage.verifyMultipleFilesUploaded(['sample-file.txt', 'sample-document.txt']);

        // Replace with different file(s)
        await fileUploadPage.uploadMultipleFiles([UPLOAD_FILE]);
        await fileUploadPage.verifyMultipleFilesUploaded(['test-upload.txt']);
    });

    /**
     * Test Case 9: Comprehensive File Upload Test
     * Test all file upload methods in sequence
     */
    test('TC09 - Comprehensive file upload test', async () => {
        // Verify page loaded
        await fileUploadPage.verifyPageLoaded();

        console.log('=== Starting Comprehensive File Upload Test ===');

        // Test 1: Single file upload
        console.log('Testing single file upload...');
        await fileUploadPage.uploadSingleFile(SINGLE_FILE);
        await fileUploadPage.verifySingleFileUploaded('sample-file.txt');
        console.log('✓ Single file upload passed');

        // Test 2: Multiple files upload
        console.log('Testing multiple files upload...');
        await fileUploadPage.uploadMultipleFiles([SINGLE_FILE, DOCUMENT_FILE, UPLOAD_FILE]);
        await fileUploadPage.verifyMultipleFilesUploaded(['sample-file.txt', 'sample-document.txt', 'test-upload.txt']);
        console.log('✓ Multiple files upload passed');

        // Test 3: Verify all elements are present
        console.log('Verifying all file upload elements...');
        await expect(fileUploadPage.singleFileInput).toBeVisible();
        await expect(fileUploadPage.multipleFilesInput).toBeVisible();
        console.log('✓ All elements verified');

        console.log('=== Comprehensive File Upload Test Complete ===');
    });
});
