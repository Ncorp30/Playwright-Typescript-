import { test, expect } from '@playwright/test';
import { ButtonsPage } from '../../pages/BasicTesting/ButtonsPage';

/**
 * Buttons Automation Tests
 * 
 * Test suite covering all 7 automation challenges for the Buttons page:
 * 1. Variant Verification - Click each button variant and verify toast notification
 * 2. Disabled State Test - Verify disabled buttons cannot be clicked
 * 3. Loading Indicators - Verify loading buttons display spinner
 * 4. Size Interactions - Verify click behavior for different sizes
 * 5. Icon & Text Validation - Verify buttons with icons display correctly
 * 6. Accessibility Check - Verify icon-only button has proper accessibility
 * 7. Comprehensive Test Run - Test all buttons in single execution
 */

test.describe('Buttons Automation Challenge', () => {
    let buttonsPage: ButtonsPage;

    test.beforeEach(async ({ page }) => {
        buttonsPage = new ButtonsPage(page);
        await buttonsPage.navigate();
        await buttonsPage.waitForPageLoad();
    });

    /**
     * Test Case 1: Button Variant Verification
     * Click each button variant and verify toast notification appears
     */
    test('TC01 - Button variants trigger toast notifications', async () => {
        // Verify page loaded
        await buttonsPage.verifyPageLoaded();

        // Test Default button
        await buttonsPage.defaultButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const defaultToast = await buttonsPage.getToastMessage();
        expect(defaultToast.toLowerCase()).toContain('default');

        await buttonsPage.waitForToastToDisappear();

        // Test Secondary button
        await buttonsPage.secondaryButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const secondaryToast = await buttonsPage.getToastMessage();
        expect(secondaryToast.toLowerCase()).toContain('secondary');

        await buttonsPage.waitForToastToDisappear();

        // Test Destructive button
        await buttonsPage.destructiveButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const destructiveToast = await buttonsPage.getToastMessage();
        expect(destructiveToast.toLowerCase()).toContain('destructive');

        await buttonsPage.waitForToastToDisappear();

        // Test Outline button
        await buttonsPage.outlineButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const outlineToast = await buttonsPage.getToastMessage();
        expect(outlineToast.toLowerCase()).toContain('outline');

        await buttonsPage.waitForToastToDisappear();

        // Test Ghost button
        await buttonsPage.ghostButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const ghostToast = await buttonsPage.getToastMessage();
        expect(ghostToast.toLowerCase()).toContain('ghost');

        await buttonsPage.waitForToastToDisappear();

        // Test Link button
        await buttonsPage.linkButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const linkToast = await buttonsPage.getToastMessage();
        expect(linkToast.toLowerCase()).toContain('link');
    });

    /**
     * Test Case 2: Disabled State Test
     * Verify disabled buttons are actually disabled and cannot trigger toasts
     */
    test('TC02 - Disabled buttons cannot be clicked', async () => {
        // Verify disabled button is disabled
        const isDisabled = await buttonsPage.isDisabledButtonDisabled();
        expect(isDisabled).toBe(true);

        // Verify disabled secondary button is disabled
        const isSecondaryDisabled = await buttonsPage.isDisabledSecondaryButtonDisabled();
        expect(isSecondaryDisabled).toBe(true);

        // Verify disabled button has correct attribute
        await expect(buttonsPage.disabledButton).toHaveAttribute('disabled', '');
        await expect(buttonsPage.disabledSecondaryButton).toHaveAttribute('disabled', '');

        // Attempt to click disabled button should not trigger toast
        const toastTriggered = await buttonsPage.attemptClickDisabledButton();
        expect(toastTriggered).toBe(false);
    });

    /**
     * Test Case 3: Loading Indicators
     * Verify loading buttons display spinner and are disabled
     */
    test('TC03 - Loading buttons display spinner and are disabled', async () => {
        // Verify loading button is disabled
        const isLoadingDisabled = await buttonsPage.isLoadingButtonDisabled();
        expect(isLoadingDisabled).toBe(true);

        // Verify loading outline button is disabled
        const isLoadingOutlineDisabled = await buttonsPage.isLoadingOutlineButtonDisabled();
        expect(isLoadingOutlineDisabled).toBe(true);

        // Verify loading button has a spinner (SVG with animate-spin class or similar)
        const hasSpinner = await buttonsPage.hasLoadingSpinner();
        expect(hasSpinner).toBe(true);

        // Verify loading buttons have disabled attribute
        await expect(buttonsPage.loadingButton).toBeDisabled();
        await expect(buttonsPage.loadingOutlineButton).toBeDisabled();

        // Verify loading button text contains "Loading"
        const loadingText = await buttonsPage.loadingButton.textContent();
        expect(loadingText?.toLowerCase()).toContain('loading');

        // Verify processing button text contains "Processing"
        const processingText = await buttonsPage.loadingOutlineButton.textContent();
        expect(processingText?.toLowerCase()).toContain('processing');
    });

    /**
     * Test Case 4: Size Interactions
     * Verify click behavior and visual presence of buttons in different sizes
     */
    test('TC04 - Button sizes trigger correct toasts', async () => {
        // Test Small button
        await buttonsPage.smallButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const smallToast = await buttonsPage.getToastMessage();
        expect(smallToast.toLowerCase()).toContain('small');

        await buttonsPage.waitForToastToDisappear();

        // Test Default size button
        await buttonsPage.defaultSizeButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const defaultSizeToast = await buttonsPage.getToastMessage();
        expect(defaultSizeToast.toLowerCase()).toContain('default');

        await buttonsPage.waitForToastToDisappear();

        // Test Large button
        await buttonsPage.largeButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const largeToast = await buttonsPage.getToastMessage();
        expect(largeToast.toLowerCase()).toContain('large');
    });

    /**
     * Test Case 5: Icon & Text Validation
     * Verify buttons with icons display both the icon element and text label
     */
    test('TC05 - Icon buttons display icon and text correctly', async () => {
        // Verify Icon Left button has SVG icon
        const hasIconLeft = await buttonsPage.hasIconLeft();
        expect(hasIconLeft).toBe(true);

        // Verify Icon Right button has SVG icon
        const hasIconRight = await buttonsPage.hasIconRight();
        expect(hasIconRight).toBe(true);

        // Verify Icon Left button text
        const iconLeftText = await buttonsPage.iconLeftButton.textContent();
        expect(iconLeftText?.trim()).toContain('Icon Left');

        // Verify Icon Right button text
        const iconRightText = await buttonsPage.iconRightButton.textContent();
        expect(iconRightText?.trim()).toContain('Icon Right');

        // Click Icon Left button and verify toast
        await buttonsPage.iconLeftButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const iconLeftToast = await buttonsPage.getToastMessage();
        expect(iconLeftToast).not.toBe('');

        await buttonsPage.waitForToastToDisappear();

        // Click Icon Right button and verify toast
        await buttonsPage.iconRightButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const iconRightToast = await buttonsPage.getToastMessage();
        expect(iconRightToast).not.toBe('');
    });

    /**
     * Test Case 6: Accessibility Check
     * Verify icon-only button has proper accessibility attributes
     */
    test('TC06 - Icon only button has proper accessibility attributes', async () => {
        // Verify icon only button exists and is visible
        await expect(buttonsPage.iconOnlyButton).toBeVisible();

        // Check accessibility attributes
        const accessibility = await buttonsPage.getIconOnlyAccessibility();

        // Either sr-only text OR aria-label should be present
        const hasAccessibility = accessibility.hasSrOnlyText || accessibility.hasAriaLabel;
        expect(hasAccessibility).toBe(true);

        // If sr-only text exists, it should not be empty
        if (accessibility.hasSrOnlyText) {
            expect(accessibility.srText.length).toBeGreaterThan(0);
            console.log('Screen reader text found:', accessibility.srText);
        }

        // Verify icon only button has an SVG icon
        const iconOnlySvg = buttonsPage.iconOnlyButton.locator('svg');
        await expect(iconOnlySvg).toBeVisible();

        // Click icon only button and verify toast
        await buttonsPage.iconOnlyButton.click();
        await buttonsPage.page.waitForTimeout(500);
        const iconOnlyToast = await buttonsPage.getToastMessage();
        expect(iconOnlyToast).not.toBe('');
    });

    /**
     * Test Case 7: Comprehensive Test Run
     * Test all buttons on the page in a single execution
     */
    test('TC07 - Comprehensive test of all buttons', async () => {
        // Verify page loaded
        await buttonsPage.verifyPageLoaded();

        // Get all clickable buttons
        const allButtons = buttonsPage.getAllClickableButtons();

        // Verify all clickable buttons are visible
        for (const button of allButtons) {
            await expect(button).toBeVisible();
        }

        // Click all buttons and collect toast messages
        const results = await buttonsPage.clickAllButtonsAndCollectToasts();

        // Verify all clickable buttons triggered a toast
        console.log('Button click results:');
        for (const result of results) {
            console.log(`  ${result.buttonName}: ${result.toastMessage || 'No toast'}`);
            // Each clickable button should trigger a toast (non-empty message)
            expect(result.toastMessage).not.toBe('');
        }

        // Verify we tested all 12 clickable buttons
        expect(results.length).toBe(12);
    });

    /**
     * Test Case 8: Button Visibility Check
     * Verify all button types are visible on the page
     */
    test('TC08 - All button types are visible on page', async () => {
        // Button Variants
        await expect(buttonsPage.defaultButton).toBeVisible();
        await expect(buttonsPage.secondaryButton).toBeVisible();
        await expect(buttonsPage.destructiveButton).toBeVisible();
        await expect(buttonsPage.outlineButton).toBeVisible();
        await expect(buttonsPage.ghostButton).toBeVisible();
        await expect(buttonsPage.linkButton).toBeVisible();

        // Button Sizes
        await expect(buttonsPage.smallButton).toBeVisible();
        await expect(buttonsPage.defaultSizeButton).toBeVisible();
        await expect(buttonsPage.largeButton).toBeVisible();

        // Disabled Buttons
        await expect(buttonsPage.disabledButton).toBeVisible();
        await expect(buttonsPage.disabledSecondaryButton).toBeVisible();

        // Loading Buttons
        await expect(buttonsPage.loadingButton).toBeVisible();
        await expect(buttonsPage.loadingOutlineButton).toBeVisible();

        // Icon Buttons
        await expect(buttonsPage.iconLeftButton).toBeVisible();
        await expect(buttonsPage.iconRightButton).toBeVisible();
        await expect(buttonsPage.iconOnlyButton).toBeVisible();
    });
});
