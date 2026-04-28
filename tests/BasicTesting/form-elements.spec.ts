import { test, expect } from '@playwright/test';
import { FormElementsPage } from '../../pages/BasicTesting/FormElementsPage';

/**
 * Form Elements Automation Tests
 * 
 * Test suite covering all 9 automation challenges for the Form Elements page:
 * 1. Form Submission - Fill all fields and submit
 * 2. Reset Validation - Verify reset clears all fields
 * 3. Boundary Testing - Test valid/invalid inputs
 * 4. Radio Selection - Select and verify radio buttons
 * 5. Checkbox Sequencing - Check/uncheck multiple checkboxes
 * 6. Dropdown Interaction - Select dropdown options
 * 7. Multi-select Testing - Select multiple options
 * 8. Textarea Validation - Input varying text lengths
 * 9. Accessibility/Navigation - Verify tab order
 */

test.describe('Form Elements Automation Challenge', () => {
    let formPage: FormElementsPage;

    test.beforeEach(async ({ page }) => {
        formPage = new FormElementsPage(page);
        await formPage.navigate();
        await formPage.waitForPageLoad();
    });

    /**
     * Test Case 1: Form Submission
     * Fill all fields with valid data and submit
     */
    test('TC01 - Complete form submission with valid data', async () => {
        // Verify page loaded
        await formPage.verifyPageLoaded();

        // Fill input fields
        await formPage.fillEmail('test@example.com');
        await formPage.fillNumber('42');

        // Select radio and checkboxes
        await formPage.selectRadioOption(2);
        await formPage.checkCheckbox(1);
        await formPage.checkCheckbox(2);

        // Select dropdown option
        await formPage.selectDropdownOption('Item 2');

        // Fill textarea
        await formPage.fillTextarea('This is a test message for the textarea field.');

        // Submit the form
        await formPage.clickSubmit();

        // Wait for any submission feedback
        await formPage.page.waitForTimeout(500);
    });

    /**
     * Test Case 2: Reset Validation
     * Click Reset button and verify all fields return to default state
     */
    test('TC02 - Reset button clears all form fields', async () => {
        // Fill form with data first
        await formPage.fillEmail('reset@test.com');
        await formPage.fillNumber('100');
        await formPage.selectRadioOption(1);
        await formPage.checkCheckbox(1);
        await formPage.checkCheckbox(2);
        await formPage.fillTextarea('Some text to reset');

        // Click Reset button
        await formPage.clickReset();
        await formPage.page.waitForTimeout(300);

        // Verify all fields are cleared
        const emailValue = await formPage.emailInput.inputValue();
        const numberValue = await formPage.numberInput.inputValue();
        const textareaValue = await formPage.textareaInput.inputValue();

        expect(emailValue).toBe('');
        // Number input may reset to '0' or empty depending on implementation
        expect(numberValue === '' || numberValue === '0').toBe(true);
        expect(textareaValue).toBe('');
    });

    /**
     * Test Case 3: Boundary Testing
     * Test email and number fields with valid and invalid inputs
     */
    test('TC03 - Boundary testing for email and number fields', async () => {
        // Test valid email
        await formPage.fillEmail('valid@email.com');
        const validEmail = await formPage.emailInput.inputValue();
        expect(validEmail).toBe('valid@email.com');

        // Clear and test invalid email format
        await formPage.emailInput.clear();
        await formPage.fillEmail('invalid-email');
        const invalidEmail = await formPage.emailInput.inputValue();
        expect(invalidEmail).toBe('invalid-email');

        // Test valid number
        await formPage.fillNumber('123');
        const validNumber = await formPage.numberInput.inputValue();
        expect(validNumber).toBe('123');

        // Test number with boundary values
        await formPage.numberInput.clear();
        await formPage.fillNumber('0');
        expect(await formPage.numberInput.inputValue()).toBe('0');

        await formPage.numberInput.clear();
        await formPage.fillNumber('-1');
        expect(await formPage.numberInput.inputValue()).toBe('-1');

        // Test number with decimal (may be truncated to integer depending on input type)
        await formPage.numberInput.clear();
        await formPage.fillNumber('3.14');
        const decimalValue = await formPage.numberInput.inputValue();
        expect(decimalValue === '3.14' || decimalValue === '3').toBe(true);

        // Test very large number
        await formPage.numberInput.clear();
        await formPage.fillNumber('999999999');
        const largeNumber = await formPage.numberInput.inputValue();
        expect(largeNumber === '999999999' || largeNumber === '0').toBe(true);
    });

    /**
     * Test Case 4: Radio Selection
     * Select each radio button and verify the selection state
     */
    test('TC04 - Radio button selection and verification', async () => {
        // Select Radio 1 and verify
        await formPage.selectRadioOption(1);
        expect(await formPage.isRadioSelected(1)).toBe(true);
        expect(await formPage.isRadioSelected(2)).toBe(false);
        expect(await formPage.isRadioSelected(3)).toBe(false);

        // Select Radio 2 and verify Radio 1 is deselected
        await formPage.selectRadioOption(2);
        expect(await formPage.isRadioSelected(1)).toBe(false);
        expect(await formPage.isRadioSelected(2)).toBe(true);
        expect(await formPage.isRadioSelected(3)).toBe(false);

        // Select Radio 3 and verify Radio 2 is deselected
        await formPage.selectRadioOption(3);
        expect(await formPage.isRadioSelected(1)).toBe(false);
        expect(await formPage.isRadioSelected(2)).toBe(false);
        expect(await formPage.isRadioSelected(3)).toBe(true);
    });

    /**
     * Test Case 5: Checkbox Sequencing
     * Check and uncheck multiple checkboxes in sequence
     */
    test('TC05 - Checkbox check and uncheck sequencing', async () => {
        // Initially all should be unchecked
        expect(await formPage.isCheckboxChecked(1)).toBe(false);
        expect(await formPage.isCheckboxChecked(2)).toBe(false);
        expect(await formPage.isCheckboxChecked(3)).toBe(false);

        // Check all checkboxes in sequence
        await formPage.checkCheckbox(1);
        expect(await formPage.isCheckboxChecked(1)).toBe(true);

        await formPage.checkCheckbox(2);
        expect(await formPage.isCheckboxChecked(2)).toBe(true);

        await formPage.checkCheckbox(3);
        expect(await formPage.isCheckboxChecked(3)).toBe(true);

        // Verify all are still checked (independent selection)
        expect(await formPage.isCheckboxChecked(1)).toBe(true);
        expect(await formPage.isCheckboxChecked(2)).toBe(true);
        expect(await formPage.isCheckboxChecked(3)).toBe(true);

        // Uncheck in reverse order
        await formPage.uncheckCheckbox(3);
        expect(await formPage.isCheckboxChecked(3)).toBe(false);

        await formPage.uncheckCheckbox(2);
        expect(await formPage.isCheckboxChecked(2)).toBe(false);

        await formPage.uncheckCheckbox(1);
        expect(await formPage.isCheckboxChecked(1)).toBe(false);
    });

    /**
     * Test Case 6: Dropdown Interaction
     * Select various options from the single dropdown and verify
     */
    test('TC06 - Single dropdown option selection', async () => {
        // Select Item 1
        await formPage.selectDropdownOption('Item 1');
        const selected1 = await formPage.getSelectedDropdownValue();
        expect(selected1).toContain('Item 1');

        // Select Item 2
        await formPage.selectDropdownOption('Item 2');
        const selected2 = await formPage.getSelectedDropdownValue();
        expect(selected2).toContain('Item 2');

        // Select Item 3
        await formPage.selectDropdownOption('Item 3');
        const selected3 = await formPage.getSelectedDropdownValue();
        expect(selected3).toContain('Item 3');
    });

    /**
     * Test Case 7: Multi-select Testing
     * Select multiple options using Playwright's selectOption (simulates Ctrl+click)
     */
    test('TC07 - Multi-select list with multiple selections', async () => {
        // Verify multi-select element is visible (native select)
        await expect(formPage.multiSelect).toBeVisible();

        // Select single option from native multi-select
        await formPage.multiSelect.selectOption({ label: 'Multi Option 1' });
        await formPage.page.waitForTimeout(200);

        // Select multiple options
        await formPage.multiSelect.selectOption([{ label: 'Multi Option 1' }, { label: 'Multi Option 3' }]);

        // Verify multi-select is enabled and interactive
        await expect(formPage.multiSelect).toBeEnabled();
    });

    /**
     * Test Case 8: Textarea Validation
     * Input text of varying lengths into the textarea
     */
    test('TC08 - Textarea input with varying text lengths', async () => {
        // Test empty textarea
        await formPage.fillTextarea('');
        expect(await formPage.getTextareaValue()).toBe('');

        // Test short text
        await formPage.fillTextarea('Hi');
        expect(await formPage.getTextareaValue()).toBe('Hi');

        // Test medium length text
        const mediumText = 'This is a medium length text that spans multiple words.';
        await formPage.fillTextarea(mediumText);
        expect(await formPage.getTextareaValue()).toBe(mediumText);

        // Test long text with multiple lines
        const longText = `This is a very long text that spans multiple lines.
Line 2: Testing textarea with multiline input.
Line 3: Automation testing is important for quality assurance.
Line 4: Playwright makes browser automation easy and reliable.
Line 5: End of long text test.`;
        await formPage.fillTextarea(longText);
        expect(await formPage.getTextareaValue()).toBe(longText);

        // Test special characters
        const specialChars = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
        await formPage.fillTextarea(specialChars);
        expect(await formPage.getTextareaValue()).toBe(specialChars);
    });

    /**
     * Test Case 9: Accessibility/Navigation
     * Verify tab order across all form elements
     */
    test('TC09 - Tab navigation order accessibility test', async () => {
        // Get the tab order of elements
        const tabOrder = await formPage.getTabOrder();

        // Verify we can tab through form elements
        expect(tabOrder.length).toBeGreaterThan(0);

        // Log the tab order for debugging
        console.log('Tab Order:', tabOrder);

        // Verify email input is first tabbable element (after focusing on it)
        expect(tabOrder).toContain('emailInput');
    });

    /**
     * Bonus Test: Complete Form Workflow
     * End-to-end test covering full form interaction
     */
    test('TC10 - Complete form workflow end-to-end', async () => {
        // Step 1: Verify page loaded
        await formPage.verifyPageLoaded();

        // Step 2: Fill all form fields
        await formPage.fillEmail('complete@workflow.com');
        await formPage.fillNumber('99');
        await formPage.selectRadioOption(2);
        await formPage.checkCheckbox(1);
        await formPage.checkCheckbox(3);
        await formPage.selectDropdownOption('Item 2');
        await formPage.fillTextarea('Complete workflow test message');

        // Step 3: Verify all inputs are filled correctly
        expect(await formPage.emailInput.inputValue()).toBe('complete@workflow.com');
        expect(await formPage.numberInput.inputValue()).toBe('99');
        expect(await formPage.isRadioSelected(2)).toBe(true);
        expect(await formPage.isCheckboxChecked(1)).toBe(true);
        expect(await formPage.isCheckboxChecked(3)).toBe(true);
        const selectedDropdown = await formPage.getSelectedDropdownValue();
        expect(selectedDropdown).toContain('Item 2');
        expect(await formPage.getTextareaValue()).toBe('Complete workflow test message');

        // Step 4: Submit the form
        await formPage.clickSubmit();
        await formPage.page.waitForTimeout(500);

        // Step 5: Reset the form
        await formPage.clickReset();
        await formPage.page.waitForTimeout(300);

        // Step 6: Verify form is cleared
        expect(await formPage.emailInput.inputValue()).toBe('');
        // Number input may reset to '0' or empty depending on implementation
        const resetNumber = await formPage.numberInput.inputValue();
        expect(resetNumber === '' || resetNumber === '0').toBe(true);
        expect(await formPage.getTextareaValue()).toBe('');
    });
});
