import { Page, Locator, expect } from '@playwright/test';

/**
 * ButtonsPage - Page Object Model for the Buttons page
 * 
 * This class encapsulates all locators and actions related to the Buttons page.
 * Following POM best practices for maintainability and reusability.
 */
export class ButtonsPage {
    // Page instance
    readonly page: Page;

    // =========================================
    // LOCATORS - Button Variants
    // =========================================

    /** Default button */
    readonly defaultButton: Locator;

    /** Secondary button */
    readonly secondaryButton: Locator;

    /** Destructive button */
    readonly destructiveButton: Locator;

    /** Outline button */
    readonly outlineButton: Locator;

    /** Ghost button */
    readonly ghostButton: Locator;

    /** Link button */
    readonly linkButton: Locator;

    // =========================================
    // LOCATORS - Button Sizes
    // =========================================

    /** Small button */
    readonly smallButton: Locator;

    /** Default size button */
    readonly defaultSizeButton: Locator;

    /** Large button */
    readonly largeButton: Locator;

    // =========================================
    // LOCATORS - Disabled Buttons
    // =========================================

    /** Disabled button */
    readonly disabledButton: Locator;

    /** Disabled secondary button */
    readonly disabledSecondaryButton: Locator;

    // =========================================
    // LOCATORS - Loading Buttons
    // =========================================

    /** Loading button */
    readonly loadingButton: Locator;

    /** Loading outline button */
    readonly loadingOutlineButton: Locator;

    // =========================================
    // LOCATORS - Icon Buttons
    // =========================================

    /** Icon left button */
    readonly iconLeftButton: Locator;

    /** Icon right button */
    readonly iconRightButton: Locator;

    /** Icon only button */
    readonly iconOnlyButton: Locator;

    // =========================================
    // LOCATORS - Navigation & Toast
    // =========================================

    /** Navigation locators */
    readonly basicTestingNav: Locator;
    readonly buttonsNav: Locator;

    /** Toast notification */
    readonly toastNotification: Locator;

    /**
     * Constructor - Initialize all locators
     * @param page - Playwright Page instance
     */
    constructor(page: Page) {
        this.page = page;

        // Button Variants
        this.defaultButton = page.locator('[data-testid="default-button"]');
        this.secondaryButton = page.locator('[data-testid="secondary-button"]');
        this.destructiveButton = page.locator('[data-testid="destructive-button"]');
        this.outlineButton = page.locator('[data-testid="outline-button"]');
        this.ghostButton = page.locator('[data-testid="ghost-button"]');
        this.linkButton = page.locator('[data-testid="link-button"]');

        // Button Sizes
        this.smallButton = page.locator('[data-testid="small-button"]');
        this.defaultSizeButton = page.locator('[data-testid="default-size-button"]');
        this.largeButton = page.locator('[data-testid="large-button"]');

        // Disabled Buttons
        this.disabledButton = page.locator('[data-testid="disabled-button"]');
        this.disabledSecondaryButton = page.locator('[data-testid="disabled-secondary-button"]');

        // Loading Buttons
        this.loadingButton = page.locator('[data-testid="loading-button"]');
        this.loadingOutlineButton = page.locator('[data-testid="loading-outline-button"]');

        // Icon Buttons
        this.iconLeftButton = page.locator('[data-testid="icon-left-button"]');
        this.iconRightButton = page.locator('[data-testid="icon-right-button"]');
        this.iconOnlyButton = page.locator('[data-testid="icon-only-button"]');

        // Navigation
        this.basicTestingNav = page.locator('text=Basic Testing').first();
        this.buttonsNav = page.locator('a[href="/buttons"]');

        // Toast notification (common patterns for toast libraries)
        this.toastNotification = page.locator('[role="status"], [data-sonner-toast], .toast, [class*="toast"]').first();
    }

    // =========================================
    // PAGE ACTIONS - Navigation
    // =========================================

    /**
     * Navigate to the Buttons page via sidebar (required for SPA routing)
     * Direct URL navigation to /buttons returns 404 on Azure Static Web Apps
     */
    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
        await this.buttonsNav.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Navigate from home page to Buttons page via sidebar
     * @deprecated Use navigate() instead
     */
    async navigateFromHome(): Promise<void> {
        await this.navigate();
    }

    /**
     * Wait for the page to be fully loaded
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify the Buttons page is displayed
     */
    async verifyPageLoaded(): Promise<void> {
        await expect(this.defaultButton).toBeVisible();
        await expect(this.secondaryButton).toBeVisible();
        await expect(this.destructiveButton).toBeVisible();
    }

    // =========================================
    // PAGE ACTIONS - Button Clicks
    // =========================================

    /**
     * Click a button variant and verify toast appears
     * @param variant - Button variant to click
     * @returns Toast message text
     */
    async clickButtonVariant(variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'): Promise<string> {
        const buttonMap = {
            'default': this.defaultButton,
            'secondary': this.secondaryButton,
            'destructive': this.destructiveButton,
            'outline': this.outlineButton,
            'ghost': this.ghostButton,
            'link': this.linkButton
        };

        await buttonMap[variant].click();
        await this.page.waitForTimeout(300);

        // Get toast text
        const toastText = await this.getToastMessage();
        return toastText;
    }

    /**
     * Click a size variant button
     * @param size - Button size to click
     * @returns Toast message text
     */
    async clickSizeButton(size: 'small' | 'default' | 'large'): Promise<string> {
        const buttonMap = {
            'small': this.smallButton,
            'default': this.defaultSizeButton,
            'large': this.largeButton
        };

        await buttonMap[size].click();
        await this.page.waitForTimeout(300);

        const toastText = await this.getToastMessage();
        return toastText;
    }

    /**
     * Click an icon button
     * @param iconPosition - Icon button position
     * @returns Toast message text
     */
    async clickIconButton(iconPosition: 'left' | 'right' | 'only'): Promise<string> {
        const buttonMap = {
            'left': this.iconLeftButton,
            'right': this.iconRightButton,
            'only': this.iconOnlyButton
        };

        await buttonMap[iconPosition].click();
        await this.page.waitForTimeout(300);

        const toastText = await this.getToastMessage();
        return toastText;
    }

    // =========================================
    // PAGE ACTIONS - Toast Verification
    // =========================================

    /**
     * Get the toast notification message
     * @returns Toast message text
     */
    async getToastMessage(): Promise<string> {
        try {
            await this.toastNotification.waitFor({ state: 'visible', timeout: 2000 });
            const text = await this.toastNotification.textContent();
            return text?.trim() || '';
        } catch {
            return '';
        }
    }

    /**
     * Wait for toast to disappear
     */
    async waitForToastToDisappear(): Promise<void> {
        try {
            await this.toastNotification.waitFor({ state: 'hidden', timeout: 5000 });
        } catch {
            // Toast may have already disappeared
        }
    }

    // =========================================
    // PAGE ACTIONS - Disabled State Verification
    // =========================================

    /**
     * Check if disabled button is actually disabled
     * @returns True if disabled button is disabled
     */
    async isDisabledButtonDisabled(): Promise<boolean> {
        return await this.disabledButton.isDisabled();
    }

    /**
     * Check if disabled secondary button is actually disabled
     * @returns True if disabled secondary button is disabled
     */
    async isDisabledSecondaryButtonDisabled(): Promise<boolean> {
        return await this.disabledSecondaryButton.isDisabled();
    }

    /**
     * Attempt to click a disabled button (for testing)
     * Returns false if click is blocked
     */
    async attemptClickDisabledButton(): Promise<boolean> {
        const initialToastCount = await this.page.locator('[role="status"], [data-sonner-toast]').count();

        try {
            await this.disabledButton.click({ force: true, timeout: 1000 });
            await this.page.waitForTimeout(500);
        } catch {
            return false;
        }

        const newToastCount = await this.page.locator('[role="status"], [data-sonner-toast]').count();
        return newToastCount > initialToastCount;
    }

    // =========================================
    // PAGE ACTIONS - Loading State Verification
    // =========================================

    /**
     * Check if loading button has spinner
     * @returns True if loading button has spinner
     */
    async hasLoadingSpinner(): Promise<boolean> {
        const spinner = this.loadingButton.locator('svg.animate-spin, .spinner, [class*="animate"]');
        return await spinner.isVisible();
    }

    /**
     * Check if loading button is disabled
     * @returns True if loading button is disabled
     */
    async isLoadingButtonDisabled(): Promise<boolean> {
        return await this.loadingButton.isDisabled();
    }

    /**
     * Check if loading outline button is disabled
     * @returns True if loading outline button is disabled
     */
    async isLoadingOutlineButtonDisabled(): Promise<boolean> {
        return await this.loadingOutlineButton.isDisabled();
    }

    // =========================================
    // PAGE ACTIONS - Icon Verification
    // =========================================

    /**
     * Check if icon left button has an icon element
     * @returns True if button contains an SVG icon
     */
    async hasIconLeft(): Promise<boolean> {
        const icon = this.iconLeftButton.locator('svg');
        return await icon.isVisible();
    }

    /**
     * Check if icon right button has an icon element
     * @returns True if button contains an SVG icon
     */
    async hasIconRight(): Promise<boolean> {
        const icon = this.iconRightButton.locator('svg');
        return await icon.isVisible();
    }

    /**
     * Check if icon only button has proper accessibility
     * @returns Object containing accessibility info
     */
    async getIconOnlyAccessibility(): Promise<{ hasSrOnlyText: boolean; hasAriaLabel: boolean; srText: string }> {
        const srOnlySpan = this.iconOnlyButton.locator('.sr-only, [class*="sr-only"]');
        const hasSrOnlyText = await srOnlySpan.isVisible().catch(() => false);

        let srText = '';
        if (hasSrOnlyText) {
            srText = await srOnlySpan.textContent() || '';
        }

        const ariaLabel = await this.iconOnlyButton.getAttribute('aria-label');
        const hasAriaLabel = !!ariaLabel;

        return { hasSrOnlyText, hasAriaLabel, srText: srText.trim() };
    }

    // =========================================
    // PAGE ACTIONS - Comprehensive Testing
    // =========================================

    /**
     * Get all clickable buttons on the page
     * @returns Array of button locators
     */
    getAllClickableButtons(): Locator[] {
        return [
            this.defaultButton,
            this.secondaryButton,
            this.destructiveButton,
            this.outlineButton,
            this.ghostButton,
            this.linkButton,
            this.smallButton,
            this.defaultSizeButton,
            this.largeButton,
            this.iconLeftButton,
            this.iconRightButton,
            this.iconOnlyButton
        ];
    }

    /**
     * Click all buttons and collect toast messages
     * Note: This method is optimized for speed with reduced wait times
     * @returns Array of objects with button name and toast message
     */
    async clickAllButtonsAndCollectToasts(): Promise<{ buttonName: string; toastMessage: string }[]> {
        const results: { buttonName: string; toastMessage: string }[] = [];

        const buttons = [
            { name: 'Default Button', locator: this.defaultButton },
            { name: 'Secondary Button', locator: this.secondaryButton },
            { name: 'Destructive Button', locator: this.destructiveButton },
            { name: 'Outline Button', locator: this.outlineButton },
            { name: 'Ghost Button', locator: this.ghostButton },
            { name: 'Link Button', locator: this.linkButton },
            { name: 'Small Button', locator: this.smallButton },
            { name: 'Default Size Button', locator: this.defaultSizeButton },
            { name: 'Large Button', locator: this.largeButton },
            { name: 'Icon Left Button', locator: this.iconLeftButton },
            { name: 'Icon Right Button', locator: this.iconRightButton },
            { name: 'Icon Only Button', locator: this.iconOnlyButton }
        ];

        for (const button of buttons) {
            await button.locator.click();
            await this.page.waitForTimeout(300);
            const toastMessage = await this.getToastMessage();
            results.push({ buttonName: button.name, toastMessage });
            // Quick wait for toast to start disappearing (don't wait for full disappear)
            await this.page.waitForTimeout(200);
        }

        return results;
    }
}
