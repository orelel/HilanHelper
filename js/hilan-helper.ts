declare var $;

class HilanHelper {
    private pageContent;
    private calendarCurrentMonthYear;
    private exceptionArray;


    constructor() {
        this.init();
        this.exceptionArray = ['חופשה', 'מחלה', 'חג', 'מילואים']

    }
    private init = async () => {
        try {
            this.pageContent = await this.getIframeContent();
            this.addButtonListener('#ctl00_mp_calendar_prev');
            this.getCalendarCalculatedData();
        }
        catch (err) {
            //TODO: something
        }
    }

    private getCalendarCalculatedData = () => {

        this.calendarCurrentMonthYear = this.pageContent.querySelector('#ctl00_mp_currentMonth').value;
        const totalWorkHours = this.getTotalWorkHoursInMinutes();
        const totalShouldWorkHours = this.getTotalShouldWorkHoursInMinutes();
        const missingHours = totalShouldWorkHours - totalWorkHours;
        const avarageHoursLeftPerDay = this.getAvarageHoursPerDay();

        const getHoursMinutesFormat = (timeMinutes: number) => {
            if (timeMinutes < 0) {
                return 0
            }
            return `${Math.floor((timeMinutes / 60))}:${Math.floor(timeMinutes % 60)}`
        }

        this.printMyStats({
            currentMonth: this.calendarCurrentMonthYear,
            shouldWorkHours: getHoursMinutesFormat(totalShouldWorkHours),
            workHours: getHoursMinutesFormat(totalWorkHours),
            missingHours: getHoursMinutesFormat(missingHours),
            averageHoursPerDay: getHoursMinutesFormat(avarageHoursLeftPerDay)
        })
    }

    private printMyStats(options) {
        $(this.pageContent).find('#legendPlace .my-stats').empty();
        $(this.pageContent).find('#legendPlace').append(
            `<div class='my-stats'>
                <h3>נתוני החודש</h3>
                <ul>
                    <li class='current-month'>
                        <span>חודש</span>
                        <span>${options.currentMonth}</span>
                    </li>
                    <li class='should-work-hours'>
                        <span>שעות מצופות</span>
                        <span>${options.shouldWorkHours}</span>
                    </li>
                    <li class='work-hours'>
                        <span>שעות בפועל</span>
                        <span>${options.workHours}</span>
                    </li>
                    <li class='missing-hours'>
                        <span>שעות חסרות</span>
                        <span>${options.missingHours}</span>
                    </li>
                    <li class='avarage-hours-per-day'>
                    <span>ממוצע נותר ליום</span>
                    <span>${options.averageHoursPerDay}</span>
                </li>
                </ul>
             </div>`
        );
    }

    private prevMonthClicked = () => {
        setTimeout(() => {
            console.log('add click listener to previous month');
            this.getCalendarCalculatedData();

            this.addButtonListener('#ctl00_mp_calendar_prev');
            this.addButtonListener('#ctl00_mp_calendar_next');
        }, 900)
    }

    // private isHtmlReady = (selector) => {
    //     var dfd = $.Deferred();
    //     console.log($(selector).text())
    //     if ($(selector).text()) {            
    //         dfd.resolve($(selector));
    //     }

    //     console.log(dfd.state())
    //     if (dfd.state() === 'pending') {            
    //         setTimeout(() => this.isHtmlReady,10);
    //     }

    //     return dfd.promise();
    // }

    private addButtonListener = (selector) => {
        $(this.pageContent.querySelector(selector)).ready(() => {
            $(this.pageContent.querySelector(selector)).on('click', this.prevMonthClicked);
        });

    }

    private getHoursDayArray() {

        const hoursDataArray = (index) => {
            const arr = [];
            [].forEach.call(this.pageContent.querySelectorAll(`#calendar_container tr:nth-child(n+3) tr:nth-child(${index}) td:nth-child(1)`), (elem) => {
                arr.push($(elem).text())
            });
            return arr;
        }
        return {
            hours: hoursDataArray(1),
            data: hoursDataArray(2)

        }
    }

    private getTotalWorkHoursInMinutes = (): number => {
        const hoursDayArray = this.getHoursDayArray();

        return hoursDayArray.data
            .reduce((accumulator: number, currentValue, currentIndex, array) => {
                return accumulator + this.parseTimeStr(currentValue);
            }, 0);
    }

    private getUSDate(strDate) {
        const dateArr = strDate.split('/');
        if (dateArr.length === 3) {
            return new Date(`${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`)
        }
        throw Error(`invalid date format: ${strDate}`);
    }

    private getWorkingDays = () => {
        const hoursDayArray = this.getHoursDayArray();
        const workDays = hoursDayArray.hours
            .filter(cellValue => Number(cellValue))
            .filter(day => this.isNotWeekend(day, this.getUSDate(this.calendarCurrentMonthYear)))
            .length;

        return workDays;
    }

    private getExceptionsDays = () => {
        const hoursDayArray = this.getHoursDayArray();
        const exceptionsDays = hoursDayArray.data
            .filter(cellValue => this.exceptionArray.indexOf(cellValue.trim()) > -1)
            .length
        return exceptionsDays;
    }

    private getTotalShouldWorkHoursInMinutes = () => {
        const hoursDayArray = this.getHoursDayArray();
        const workDays = this.getWorkingDays();

        const exceptionsDays = this.getExceptionsDays()

        return (workDays - exceptionsDays) * 9 * 60;

    }

    private getAvarageHoursPerDay = () => {
        const hoursDayArray = this.getHoursDayArray();
        const alreayWorkDays = hoursDayArray.data
            .filter(cellValue => cellValue.match(/[0-9][0-9]?:[0-9][0-9]/))
            .length;

        const exceptionsDays = this.getExceptionsDays();
        const daysLeftToWork = this.getWorkingDays() - exceptionsDays - alreayWorkDays;
        if (daysLeftToWork > 0) {
            return (this.getTotalShouldWorkHoursInMinutes() - this.getTotalWorkHoursInMinutes()) / daysLeftToWork;
        }else{
            return 0;
        }
    }



    private isNotWeekend(day, calendarDate = new Date()) {
        const currentDate = new Date(calendarDate);
        currentDate.setDate(day);
        const dayOfWeek = currentDate.getDay();
        return dayOfWeek < 5;

    }

    private parseTimeStr(str): number {
        if (str) {
            const timeArray = str.split(':');
            if (timeArray.length !== 2) {
                return 0;
            }
            return timeArray[0] * 60 + Number(timeArray[1]);
        }
        return 0;
    }

    private documentReady() {
        var dfd = $.Deferred();
        $(document).ready(() => {
            dfd.resolve();
        });
        return dfd.promise();
    }


    private getIframeContent = () => {
        var dfd = $.Deferred();
        $(document).ready(() => {
            const iframe: any = document.querySelector('#mainIFrame');
            if (!iframe) {
                dfd.resolve(document);
            } else {
                iframe.onload = () => {
                    dfd.resolve(iframe.contentDocument || iframe.contentWindow.document);
                };
            }
        });
        return dfd.promise();
    }
}