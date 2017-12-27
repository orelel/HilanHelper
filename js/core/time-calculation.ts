class TimeCalculation{

    static exceptionArray = ['חופשה', 'מחלה', 'חג', 'מילואים']

    private static getHoursDayArray(pageContent) {
        return {
            hours: DomManipulation.getCalendarMonthData(pageContent, CalendarData.HOURS),
            data: DomManipulation.getCalendarMonthData(pageContent, CalendarData.TEXT)
        }
    }

    public static getTotalWorkHoursInMinutes(pageContent): number {
        const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);

        return hoursDayArray.data
            .reduce((accumulator: number, currentValue, currentIndex, array) => {
                return accumulator + Utility.parseTimeStr(currentValue);
            }, 0);
    }

   

    private static getWorkingDays (pageContent, calendarCurrentMonthYear){
        const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
        const workDays = hoursDayArray.hours
            .filter(cellValue => Number(cellValue))
            .filter(day => Utility.isNotWeekend(day, Utility.getUSDate(calendarCurrentMonthYear)))
            .length;

        return workDays;
    }

    private static getExceptionsDays(pageContent) {
        const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
        const exceptionsDays = hoursDayArray.data
            .filter(cellValue => TimeCalculation.exceptionArray.indexOf(cellValue.trim()) > -1)
            .length
        return exceptionsDays;
    }

    public static getTotalShouldWorkHoursInMinutes (pageContent, calendarCurrentMonthYear) {
        const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
        const workDays = TimeCalculation.getWorkingDays(pageContent, calendarCurrentMonthYear);

        const exceptionsDays = TimeCalculation.getExceptionsDays(pageContent)

        return (workDays - exceptionsDays) * 9 * 60;

    }

    public static getAvarageHoursPerDay (pageContent, calendarCurrentMonthYear) {
        const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
        const alreayWorkDays = hoursDayArray.data
            .filter(cellValue => cellValue.match(/[0-9][0-9]?:[0-9][0-9]/))
            .length;

        const exceptionsDays = TimeCalculation.getExceptionsDays(pageContent);
        const daysLeftToWork = TimeCalculation.getWorkingDays(pageContent, calendarCurrentMonthYear) - exceptionsDays - alreayWorkDays;
        if (daysLeftToWork > 0) {
            return (TimeCalculation.getTotalShouldWorkHoursInMinutes(pageContent, calendarCurrentMonthYear) - TimeCalculation.getTotalWorkHoursInMinutes(pageContent)) / daysLeftToWork;
        } else {
            return 0;
        }
    }
}