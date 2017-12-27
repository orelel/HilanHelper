var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CURRENT_MONTH_SELECTOR = '#ctl00_mp_currentMonth';
const PREV_MONTH_BUTTON_SELECTOR = '#ctl00_mp_calendar_prev';
const NEXT_MONTH_BUTTON_SELECTOR = '#ctl00_mp_calendar_next';
class HilanHelper {
    constructor() {
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.pageContent = yield DomManipulation.getIframeContent();
                DomManipulation.addButtonListener(this.pageContent, PREV_MONTH_BUTTON_SELECTOR, this.onMonthChanged);
                this.getCalendarCalculatedData();
            }
            catch (err) {
                //TODO: something
            }
        });
        this.getCalendarCalculatedData = () => {
            this.calendarCurrentMonthYear = this.pageContent.querySelector(CURRENT_MONTH_SELECTOR).value;
            const totalWorkHours = TimeCalculation.getTotalWorkHoursInMinutes(this.pageContent);
            const totalShouldWorkHours = TimeCalculation.getTotalShouldWorkHoursInMinutes(this.pageContent, this.calendarCurrentMonthYear);
            const missingHours = totalShouldWorkHours - totalWorkHours;
            const avarageHoursLeftPerDay = TimeCalculation.getAvarageHoursPerDay(this.pageContent, this.calendarCurrentMonthYear);
            const getHoursMinutesFormat = (timeMinutes) => {
                if (timeMinutes < 0) {
                    return 0;
                }
                return `${Math.floor((timeMinutes / 60))}:${Math.floor(timeMinutes % 60)}`;
            };
            DomManipulation.printMyStats(this.pageContent, {
                currentMonth: this.calendarCurrentMonthYear,
                shouldWorkHours: getHoursMinutesFormat(totalShouldWorkHours),
                workHours: getHoursMinutesFormat(totalWorkHours),
                missingHours: getHoursMinutesFormat(missingHours),
                averageHoursPerDay: getHoursMinutesFormat(avarageHoursLeftPerDay)
            });
        };
        this.onMonthChanged = () => {
            setTimeout(() => {
                console.log('add click listener to previous month');
                this.getCalendarCalculatedData();
                DomManipulation.addButtonListener(this.pageContent, PREV_MONTH_BUTTON_SELECTOR, this.onMonthChanged);
                DomManipulation.addButtonListener(this.pageContent, NEXT_MONTH_BUTTON_SELECTOR, this.onMonthChanged);
            }, 900);
        };
        this.init();
    }
}
//# sourceMappingURL=hilan-helper.js.map