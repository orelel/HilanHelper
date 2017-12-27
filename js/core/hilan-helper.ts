declare var $;
const CURRENT_MONTH_SELECTOR = '#ctl00_mp_currentMonth';
const PREV_MONTH_BUTTON_SELECTOR = '#ctl00_mp_calendar_prev';
const NEXT_MONTH_BUTTON_SELECTOR = '#ctl00_mp_calendar_next';


class HilanHelper {
    private pageContent;
    private calendarCurrentMonthYear;    

    constructor() {
        this.init();
    }
    private init = async () => {
        try {
            this.pageContent = await DomManipulation.getIframeContent();
            DomManipulation.addButtonListener(this.pageContent, PREV_MONTH_BUTTON_SELECTOR, this.onMonthChanged);
            this.getCalendarCalculatedData();
        }
        catch (err) {
            //TODO: something
        }
    }

    private getCalendarCalculatedData = () => {

        this.calendarCurrentMonthYear = this.pageContent.querySelector(CURRENT_MONTH_SELECTOR).value;
        const totalWorkHours = TimeCalculation.getTotalWorkHoursInMinutes(this.pageContent);
        const totalShouldWorkHours = TimeCalculation.getTotalShouldWorkHoursInMinutes(this.pageContent,this.calendarCurrentMonthYear);
        const missingHours = totalShouldWorkHours - totalWorkHours;
        const avarageHoursLeftPerDay = TimeCalculation.getAvarageHoursPerDay(this.pageContent,this.calendarCurrentMonthYear);

        const getHoursMinutesFormat = (timeMinutes: number) => {
            if (timeMinutes < 0) {
                return 0
            }
            return `${Math.floor((timeMinutes / 60))}:${Math.floor(timeMinutes % 60)}`
        }

        DomManipulation.printMyStats(this.pageContent, {
            currentMonth: this.calendarCurrentMonthYear,
            shouldWorkHours: getHoursMinutesFormat(totalShouldWorkHours),
            workHours: getHoursMinutesFormat(totalWorkHours),
            missingHours: getHoursMinutesFormat(missingHours),
            averageHoursPerDay: getHoursMinutesFormat(avarageHoursLeftPerDay)
        });
    }

    private onMonthChanged = () => {
        setTimeout(() => {
            console.log('add click listener to previous month');
            this.getCalendarCalculatedData();

            DomManipulation.addButtonListener(this.pageContent, PREV_MONTH_BUTTON_SELECTOR, this.onMonthChanged);
            DomManipulation.addButtonListener(this.pageContent, NEXT_MONTH_BUTTON_SELECTOR, this.onMonthChanged);
        }, 900)
    }



 







}