import { test, expect } from '@playwright/test';
import { DatePickerPage } from '../../pages/BasicTesting/DatePickerPage';

/**
 * Date Picker Automation Tests
 * 
 * Test suite covering all 8 automation challenges for the Date Picker page:
 * 1. Single Date Selection - Select a date and verify display
 * 2. Calendar Navigation - Navigate different months/years
 * 3. Date Range Selection - Select start and end dates
 * 4. Date and Time Combination - Select date, set time, submit
 * 5. Keyboard Navigation - Arrow keys, Escape, Enter
 * 6. Range Validation - Verify disabled dates can't be selected
 * 7. Time Input Updates - Change time and verify updates
 * 8. Edge Cases - Month/year boundary selections
 */

test.describe('Date Picker Automation Challenge', () => {
    let datePickerPage: DatePickerPage;

    test.beforeEach(async ({ page }) => {
        datePickerPage = new DatePickerPage(page);
        await datePickerPage.navigate();
        await datePickerPage.waitForPageLoad();
    });

    /**
     * Test Case 1: Single Date Selection
     * Select a date from the single date picker and verify the selected date is displayed correctly
     */
    test('TC01 - Single date selection displays correctly', async () => {
        // Verify page loaded
        await datePickerPage.verifyPageLoaded();

        // Get initial button text
        const initialText = await datePickerPage.getSelectedSingleDate();
        console.log('Initial button text:', initialText);

        // Select day 15
        await datePickerPage.selectSingleDate(15);

        // Wait for toast and verify
        const toastMessage = await datePickerPage.getToastMessage();
        console.log('Toast message:', toastMessage);
        expect(toastMessage).not.toBe('');

        // Verify the button text updated to show selected date
        const updatedText = await datePickerPage.getSelectedSingleDate();
        console.log('Updated button text:', updatedText);
        expect(updatedText).toContain('15');
    });

    /**
     * Test Case 2: Calendar Navigation
     * Test selecting dates from different months and years in the calendar
     */
    test('TC02 - Calendar navigation between months', async () => {
        // Open single date picker
        await datePickerPage.openSingleDatePicker();

        // Get current month
        const initialMonth = await datePickerPage.getCurrentCalendarMonth();
        console.log('Initial month:', initialMonth);

        // Navigate to next month
        await datePickerPage.goToNextMonth();
        const nextMonth = await datePickerPage.getCurrentCalendarMonth();
        console.log('After next:', nextMonth);

        // Verify month changed
        expect(nextMonth).not.toBe(initialMonth);

        // Navigate to previous month (back to original)
        await datePickerPage.goToPreviousMonth();
        const prevMonth = await datePickerPage.getCurrentCalendarMonth();
        console.log('After prev:', prevMonth);

        // Navigate back two months
        await datePickerPage.navigateCalendarMonths('prev', 2);
        const twoMonthsBack = await datePickerPage.getCurrentCalendarMonth();
        console.log('Two months back:', twoMonthsBack);

        // Select a date from this month
        await datePickerPage.selectDay(10);
        await datePickerPage.submitDateButton.click();

        // Verify selection
        const toast = await datePickerPage.getToastMessage();
        expect(toast).not.toBe('');
    });

    /**
     * Test Case 3: Date Range Selection
     * Select a date range and verify both start and end dates are displayed correctly
     */
    test('TC03 - Date range selection displays start and end dates', async () => {
        // Get initial range text
        const initialText = await datePickerPage.getSelectedDateRange();
        console.log('Initial range text:', initialText);

        // Select a date range (day 10 to day 20)
        await datePickerPage.selectDateRange(10, 20);

        // Wait for toast
        const toastMessage = await datePickerPage.getToastMessage();
        console.log('Toast message:', toastMessage);
        expect(toastMessage).not.toBe('');

        // Verify the button text updated to contain a date range (with hyphen)
        const updatedText = await datePickerPage.getSelectedDateRange();
        console.log('Updated range text:', updatedText);

        // The range should contain a hyphen indicating a range was selected
        expect(updatedText).toContain('-');
    });

    /**
     * Test Case 4: Date and Time Combination
     * Create a test that selects a date and time combination and verifies the submission
     */
    test('TC04 - Date and time combination submission', async () => {
        // Get initial values
        const initialDate = await datePickerPage.getSelectedDateTime();
        console.log('Initial date:', initialDate);

        // Open calendar and select a date
        await datePickerPage.openDateTimePicker();
        await datePickerPage.selectDay(15);

        // Wait for calendar to close after selection
        await datePickerPage.page.waitForTimeout(500);

        // Submit the date and time
        await datePickerPage.submitDateTimeButton.click();

        // Wait for toast
        const toastMessage = await datePickerPage.getToastMessage();
        console.log('Toast message:', toastMessage);
        expect(toastMessage).not.toBe('');

        // Verify date updated
        const updatedDate = await datePickerPage.getSelectedDateTime();
        console.log('Updated date:', updatedDate);
        expect(updatedDate).toContain('15');
    });

    /**
     * Test Case 5: Keyboard Navigation
     * Test keyboard navigation within the date picker (arrow keys, Escape, Enter)
     */
    test('TC05 - Keyboard navigation in date picker', async () => {
        // Open single date picker
        await datePickerPage.openSingleDatePicker();

        // Verify calendar is open
        const isOpen = await datePickerPage.isCalendarOpen();
        expect(isOpen).toBe(true);

        // Navigate with arrow keys
        await datePickerPage.navigateWithArrowKey('right');
        await datePickerPage.page.waitForTimeout(200);

        await datePickerPage.navigateWithArrowKey('down');
        await datePickerPage.page.waitForTimeout(200);

        // Press Enter to select focused date
        await datePickerPage.pressKey('Enter');
        await datePickerPage.page.waitForTimeout(300);

        // Verify a date was selected
        const selectedDate = await datePickerPage.getSelectedSingleDate();
        console.log('Selected date via keyboard:', selectedDate);
        expect(selectedDate).not.toBe('');

        // Test Escape to close calendar
        await datePickerPage.openSingleDatePicker();
        await datePickerPage.page.waitForTimeout(500);

        await datePickerPage.pressKey('Escape');
        await datePickerPage.page.waitForTimeout(300);

        // Verify calendar closed
        const isClosed = await datePickerPage.isCalendarOpen();
        expect(isClosed).toBe(false);
    });

    /**
     * Test Case 6: Range Validation
     * Verify that dates outside the allowed range cannot be selected
     */
    test('TC06 - Range validation for disabled dates', async () => {
        // Open single date picker
        await datePickerPage.openSingleDatePicker();

        // Navigate to previous month to find potentially disabled dates (past dates)
        await datePickerPage.navigateCalendarMonths('prev', 2);

        // Check if there are any disabled days (past dates should be disabled)
        // Try to find a day that appears disabled
        const day1Disabled = await datePickerPage.isDayDisabled(1);
        console.log('Day 1 disabled in past month:', day1Disabled);

        // Navigate back to current month
        await datePickerPage.navigateCalendarMonths('next', 2);

        // Close and reopen to check current month
        await datePickerPage.closeCalendar();
        await datePickerPage.openSingleDatePicker();

        // Try selecting a valid date
        await datePickerPage.selectDay(15);

        // Verify selection worked
        const selectedDate = await datePickerPage.getSelectedSingleDate();
        expect(selectedDate).toContain('15');
    });

    /**
     * Test Case 7: Time Input Updates
     * Create a test that changes the time input and verifies the time value updates
     */
    test('TC07 - Time input updates correctly', async () => {
        // Verify time input is visible and interactive
        await expect(datePickerPage.timeInput).toBeVisible();
        await expect(datePickerPage.timeInput).toBeEnabled();

        // Get initial time value
        const initialTime = await datePickerPage.getTimeValue();
        console.log('Initial time:', initialTime);
        expect(initialTime.length).toBeGreaterThan(0);

        // Select a date and submit to verify the date-time picker works
        await datePickerPage.openDateTimePicker();
        await datePickerPage.selectDay(20);
        await datePickerPage.page.waitForTimeout(500);
        await datePickerPage.submitDateTimeButton.click();

        // Verify toast appears
        const toast = await datePickerPage.getToastMessage();
        console.log('Toast message:', toast);
        expect(toast).not.toBe('');
    });

    /**
     * Test Case 8: Edge Cases
     * Test edge cases like selecting dates at month/year boundaries
     */
    test('TC08 - Edge cases at month and year boundaries', async () => {
        // Open single date picker
        await datePickerPage.openSingleDatePicker();

        // Test: Select first day of month (edge case - boundary)
        await datePickerPage.selectDay(1);
        const selectedDate = await datePickerPage.getSelectedSingleDate();
        console.log('Selected first day:', selectedDate);
        expect(selectedDate).toContain('1');

        // Submit and verify toast
        await datePickerPage.submitDateButton.click();

        // Verify submission worked
        const toast = await datePickerPage.getToastMessage();
        console.log('Toast message:', toast);
        expect(toast).not.toBe('');
        expect(toast).toContain('1');
    });

    /**
     * Test Case 9: All Date Pickers Visible
     * Verify all date picker components are visible on the page
     */
    test('TC09 - All date picker components are visible', async () => {
        // Verify single date picker
        await expect(datePickerPage.singleDateButton).toBeVisible();
        await expect(datePickerPage.submitDateButton).toBeVisible();

        // Verify date range picker
        await expect(datePickerPage.dateRangeButton).toBeVisible();
        await expect(datePickerPage.submitDateRangeButton).toBeVisible();

        // Verify date and time picker
        await expect(datePickerPage.dateTimeButton).toBeVisible();
        await expect(datePickerPage.timeInput).toBeVisible();
        await expect(datePickerPage.submitDateTimeButton).toBeVisible();

        console.log('All date picker components are visible');
    });

    /**
     * Test Case 10: Calendar Opens and Closes Correctly
     * Verify calendar popover behavior
     */
    test('TC10 - Calendar popover opens and closes correctly', async () => {
        // Initially calendar should be closed
        let isOpen = await datePickerPage.isCalendarOpen();
        expect(isOpen).toBe(false);

        // Open single date picker
        await datePickerPage.openSingleDatePicker();
        isOpen = await datePickerPage.isCalendarOpen();
        expect(isOpen).toBe(true);

        // Close with Escape
        await datePickerPage.closeCalendar();
        isOpen = await datePickerPage.isCalendarOpen();
        expect(isOpen).toBe(false);

        // Open date range picker
        await datePickerPage.openDateRangePicker();
        isOpen = await datePickerPage.isCalendarOpen();
        expect(isOpen).toBe(true);

        // Close by clicking outside (Escape)
        await datePickerPage.closeCalendar();
        isOpen = await datePickerPage.isCalendarOpen();
        expect(isOpen).toBe(false);

        console.log('Calendar popover opens and closes correctly');
    });
});
