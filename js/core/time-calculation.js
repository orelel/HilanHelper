class TimeCalculation {
    static getHoursDayArray(pageContent) {
        return {
            hours: DomManipulation.getCalendarMonthData(pageContent, CalendarData.HOURS),
            data: DomManipulation.getCalendarMonthData(pageContent, CalendarData.TEXT)
        };
    }
}
TimeCalculation.exceptionArray = ['חופשה', 'מחלה', 'חג', 'מילואים'];
TimeCalculation.getTotalWorkHoursInMinutes = (pageContent) => {
    const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
    return hoursDayArray.data
        .reduce((accumulator, currentValue, currentIndex, array) => {
        return accumulator + Utility.parseTimeStr(currentValue);
    }, 0);
};
TimeCalculation.getWorkingDays = (pageContent, calendarCurrentMonthYear) => {
    const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
    const workDays = hoursDayArray.hours
        .filter(cellValue => Number(cellValue))
        .filter(day => Utility.isNotWeekend(day, Utility.getUSDate(calendarCurrentMonthYear)))
        .length;
    return workDays;
};
TimeCalculation.getExceptionsDays = (pageContent) => {
    const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
    const exceptionsDays = hoursDayArray.data
        .filter(cellValue => TimeCalculation.exceptionArray.indexOf(cellValue.trim()) > -1)
        .length;
    return exceptionsDays;
};
TimeCalculation.getTotalShouldWorkHoursInMinutes = (pageContent, calendarCurrentMonthYear) => {
    const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
    const workDays = TimeCalculation.getWorkingDays(pageContent, calendarCurrentMonthYear);
    const exceptionsDays = TimeCalculation.getExceptionsDays(pageContent);
    return (workDays - exceptionsDays) * 9 * 60;
};
TimeCalculation.getAvarageHoursPerDay = (pageContent, calendarCurrentMonthYear) => {
    const hoursDayArray = TimeCalculation.getHoursDayArray(pageContent);
    const alreayWorkDays = hoursDayArray.data
        .filter(cellValue => cellValue.match(/[0-9][0-9]?:[0-9][0-9]/))
        .length;
    const exceptionsDays = TimeCalculation.getExceptionsDays(pageContent);
    const daysLeftToWork = TimeCalculation.getWorkingDays(pageContent, calendarCurrentMonthYear) - exceptionsDays - alreayWorkDays;
    if (daysLeftToWork > 0) {
        return (TimeCalculation.getTotalShouldWorkHoursInMinutes(pageContent, calendarCurrentMonthYear) - TimeCalculation.getTotalWorkHoursInMinutes(pageContent)) / daysLeftToWork;
    }
    else {
        return 0;
    }
};
//# sourceMappingURL=time-calculation.js.map