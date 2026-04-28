import { Page, Locator, expect } from '@playwright/test';

/**
 * FormElementsPage - Page Object Model for the Form Elements page
 * 
 * This class encapsulates all locators and actions related to the Form Elements page.
 * Following POM best practices for maintainability and reusability.
 */
export class FormElementsPage {
    // Page instance
    readonly page: Page;

    // =========================================
    // LOCATORS - Using readonly for immutability
    // =========================================

    /** Email input field */
    readonly emailInput: Locator;

    /** Number input field */
    readonly numberInput: Locator;

    /** Radio buttons */
    readonly radioOption1: Locator;
    readonly radioOption2: Locator;
    readonly radioOption3: Locator;

    /** Checkboxes */
    readonly checkbox1: Locator;
    readonly checkbox2: Locator;
    readonly checkbox3: Locator;

    /** Single select dropdown (custom combobox) */
    readonly singleSelectDropdown: Locator;

    /** Multi-select list */
    readonly multiSelect: Locator;

    /** Dropdown options container */
    readonly dropdownOptions: Locator;

    /** Textarea */
    readonly textareaInput: Locator;

    /** Buttons */
    readonly resetButton: Locator;
    readonly submitButton: Locator;

    /** Navigation elements */
    readonly basicTestingNav: Locator;
    readonly formElementsNav: Locator;

    /**
     * Constructor - Initialize all locators
     * @param page - Playwright Page instance
     */
    constructor(page: Page) {
        this.page = page;

        // Initialize input field locators
        this.emailInput = page.locator('#emailInput');
        this.numberInput = page.locator('#numberInput');

        // Initialize radio button locators
        this.radioOption1 = page.locator('#r1');
        this.radioOption2 = page.locator('#r2');
        this.radioOption3 = page.locator('#r3');

        // Initialize checkbox locators
        this.checkbox1 = page.locator('#option1');
        this.checkbox2 = page.locator('#option2');
        this.checkbox3 = page.locator('#option3');

        // Initialize dropdown locators (Radix UI custom combobox)
        this.singleSelectDropdown = page.locator('#selectOption');
        this.multiSelect = page.locator('#multiSelect');
        this.dropdownOptions = page.locator('[role="listbox"], [role="option"]');

        // Initialize textarea locator
        this.textareaInput = page.locator('#textareaInput');

        // Initialize button locators
        this.resetButton = page.locator('button:has-text("Reset")');
        this.submitButton = page.locator('button:has-text("Submit")');

        // Navigation locators
        this.basicTestingNav = page.locator('text=Basic Testing').first();
        this.formElementsNav = page.locator('text=Form Elements');
    }

    // =========================================
    // PAGE ACTIONS - Reusable methods
    // =========================================

    /**
     * Navigate to the Form Elements page
     */
    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
        await this.formElementsNav.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Fill email input with provided value
     * @param email - Email value to enter
     */
    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    /**
     * Fill number input with provided value
     * @param number - Number value to enter
     */
    async fillNumber(number: string): Promise<void> {
        await this.numberInput.fill(number);
    }

    /**
     * Select a radio button by option number
     * @param option - Radio option number (1, 2, or 3)
     */
    async selectRadioOption(option: 1 | 2 | 3): Promise<void> {
        switch (option) {
            case 1:
                await this.radioOption1.check();
                break;
            case 2:
                await this.radioOption2.check();
                break;
            case 3:
                await this.radioOption3.check();
                break;
        }
    }

    /**
     * Verify radio button is selected
     * @param option - Radio option number to check
     * @returns True if the radio is checked
     */
    async isRadioSelected(option: 1 | 2 | 3): Promise<boolean> {
        switch (option) {
            case 1:
                return await this.radioOption1.isChecked();
            case 2:
                return await this.radioOption2.isChecked();
            case 3:
                return await this.radioOption3.isChecked();
        }
    }

    /**
     * Check a checkbox by option number
     * @param option - Checkbox option number (1, 2, or 3)
     */
    async checkCheckbox(option: 1 | 2 | 3): Promise<void> {
        const checkbox = this.getCheckboxLocator(option);
        await checkbox.check();
    }

    /**
     * Uncheck a checkbox by option number
     * @param option - Checkbox option number (1, 2, or 3)
     */
    async uncheckCheckbox(option: 1 | 2 | 3): Promise<void> {
        const checkbox = this.getCheckboxLocator(option);
        await checkbox.uncheck();
    }

    /**
     * Get checkbox locator by option number
     */
    private getCheckboxLocator(option: 1 | 2 | 3): Locator {
        switch (option) {
            case 1:
                return this.checkbox1;
            case 2:
                return this.checkbox2;
            case 3:
                return this.checkbox3;
        }
    }

    /**
     * Verify checkbox is checked
     * @param option - Checkbox option number to check
     * @returns True if the checkbox is checked
     */
    async isCheckboxChecked(option: 1 | 2 | 3): Promise<boolean> {
        const checkbox = this.getCheckboxLocator(option);
        return await checkbox.isChecked();
    }

    /**
     * Select option from single select dropdown (Radix UI custom combobox)
     * @param optionText - Text of option to select
     */
    async selectDropdownOption(optionText: string): Promise<void> {
        // Click to open the dropdown
        await this.singleSelectDropdown.click();
        await this.page.waitForTimeout(200);

        // Click on the option with matching text
        const option = this.page.locator(`[role="option"]:has-text("${optionText}")`);
        await option.click();
    }

    /**
     * Get currently selected dropdown option text
     * @returns Selected option text
     */
    async getSelectedDropdownValue(): Promise<string> {
        const selectedText = await this.singleSelectDropdown.textContent();
        return selectedText?.trim() || '';
    }

    /**
     * Select multiple options in multi-select list
     * For Radix UI multi-select, we need to click each option
     * @param optionTexts - Array of option texts to select
     */
    async selectMultipleOptions(optionTexts: string[]): Promise<void> {
        // Check if this is a native select or custom component
        const tagName = await this.multiSelect.evaluate(el => el.tagName.toLowerCase());

        if (tagName === 'select') {
            await this.multiSelect.selectOption(optionTexts);
        } else {
            // Click to open the multi-select
            await this.multiSelect.click();
            await this.page.waitForTimeout(200);

            // Click each option
            for (const text of optionTexts) {
                const option = this.page.locator(`[role="option"]:has-text("${text}")`);
                if (await option.isVisible()) {
                    await option.click();
                }
            }

            // Click outside to close
            await this.page.keyboard.press('Escape');
        }
    }

    /**
     * Fill textarea with provided text
     * @param text - Text to enter in textarea
     */
    async fillTextarea(text: string): Promise<void> {
        await this.textareaInput.fill(text);
    }

    /**
     * Get textarea value
     * @returns Current textarea content
     */
    async getTextareaValue(): Promise<string> {
        return await this.textareaInput.inputValue();
    }

    /**
     * Click Reset button to clear the form
     */
    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }

    /**
     * Click Submit button
     */
    async clickSubmit(): Promise<void> {
        await this.submitButton.click();
    }

    /**
     * Fill the complete form with valid data
     * @param data - Form data object
     */
    async fillCompleteForm(data: {
        email: string;
        number: string;
        radioOption: 1 | 2 | 3;
        checkboxes: (1 | 2 | 3)[];
        dropdownValue: string;
        multiSelectValues: string[];
        textareaText: string;
    }): Promise<void> {
        await this.fillEmail(data.email);
        await this.fillNumber(data.number);
        await this.selectRadioOption(data.radioOption);

        for (const checkbox of data.checkboxes) {
            await this.checkCheckbox(checkbox);
        }

        await this.selectDropdownOption(data.dropdownValue);
        await this.selectMultipleOptions(data.multiSelectValues);
        await this.fillTextarea(data.textareaText);
    }

    /**
     * Verify all form fields are empty/default after reset
     * @returns True if all fields are in default state
     */
    async areAllFieldsEmpty(): Promise<boolean> {
        const emailValue = await this.emailInput.inputValue();
        const numberValue = await this.numberInput.inputValue();
        const textareaValue = await this.textareaInput.inputValue();

        const radio1Checked = await this.radioOption1.isChecked();
        const radio2Checked = await this.radioOption2.isChecked();
        const radio3Checked = await this.radioOption3.isChecked();

        const checkbox1Checked = await this.checkbox1.isChecked();
        const checkbox2Checked = await this.checkbox2.isChecked();
        const checkbox3Checked = await this.checkbox3.isChecked();

        return !emailValue &&
            !numberValue &&
            !textareaValue &&
            !radio1Checked &&
            !radio2Checked &&
            !radio3Checked &&
            !checkbox1Checked &&
            !checkbox2Checked &&
            !checkbox3Checked;
    }

    /**
     * Wait for the page to be fully loaded
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify the Form Elements page is displayed
     */
    async verifyPageLoaded(): Promise<void> {
        await expect(this.emailInput).toBeVisible();
        await expect(this.numberInput).toBeVisible();
        await expect(this.radioOption1).toBeVisible();
        await expect(this.checkbox1).toBeVisible();
        await expect(this.singleSelectDropdown).toBeVisible();
        await expect(this.textareaInput).toBeVisible();
        await expect(this.submitButton).toBeVisible();
    }

    /**
     * Scroll to the Automation Challenge section
     */
    async scrollToAutomationChallenge(): Promise<void> {
        const challengeSection = this.page.locator('text=Automation Challenge');
        await challengeSection.scrollIntoViewIfNeeded();
    }

    /**
     * Tab through form elements in order (for accessibility testing)
     * @returns Array of focused element IDs in order
     */
    async getTabOrder(): Promise<string[]> {
        const elementOrder: string[] = [];

        // Focus on email first
        await this.emailInput.focus();
        const firstFocused = await this.page.evaluate(() => document.activeElement?.id);
        if (firstFocused) elementOrder.push(firstFocused);

        // Tab through elements
        for (let i = 0; i < 15; i++) {
            await this.page.keyboard.press('Tab');
            const focusedId = await this.page.evaluate(() => document.activeElement?.id);
            if (focusedId && !elementOrder.includes(focusedId)) {
                elementOrder.push(focusedId);
            }
        }

        return elementOrder;
    }
}
