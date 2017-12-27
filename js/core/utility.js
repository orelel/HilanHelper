class Utility {
    static isNotWeekend(day, calendarDate = new Date()) {
        const currentDate = new Date(calendarDate);
        currentDate.setDate(day);
        const dayOfWeek = currentDate.getDay();
        return dayOfWeek < 5;
    }
    static parseTimeStr(str) {
        if (str) {
            const timeArray = str.split(':');
            if (timeArray.length !== 2) {
                return 0;
            }
            return timeArray[0] * 60 + Number(timeArray[1]);
        }
        return 0;
    }
    static getUSDate(strDate) {
        const dateArr = strDate.split('/');
        if (dateArr.length === 3) {
            return new Date(`${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`);
        }
        throw Error(`invalid date format: ${strDate}`);
    }
}
//# sourceMappingURL=utility.js.map