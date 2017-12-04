declare var $;

class HilanHelper {
    private pageContent;
    private calendarCurrentMonthYear;

    constructor() {
        this.init();

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
        const totalShouldWorkHours = this.getTotalShouldWorkHoursInMinutes(this.calendarCurrentMonthYear);
        const missingHours = totalShouldWorkHours - totalWorkHours;

        this.printMyStats({
            currentMonth: this.calendarCurrentMonthYear,
            shouldWorkHours: `${Math.floor((totalShouldWorkHours / 60))}:${totalShouldWorkHours % 60}`,
            workHours: `${Math.floor((totalWorkHours / 60))}:${totalWorkHours % 60}`,
            missingHours: missingHours < 0 ? 0 : `${Math.floor((missingHours / 60))}:${missingHours % 60}`
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

    private addButtonListener =  (selector) => {
        $(this.pageContent.querySelector(selector)).ready(() => {
            $(this.pageContent.querySelector(selector)).on('click', this.prevMonthClicked);
        });

    }

    private getHoursDayArray() {
        
        const hoursDataArray = (index) => {
            const arr = [];
            [].forEach.call(this.pageContent.querySelectorAll(`#calendar_container tr:nth-child(n+3) tr:nth-child(${index}) td`), (elem) => {
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

    private getTotalShouldWorkHoursInMinutes = (calendarCurrentMonthYearString: string = '') => {
        const toUsDate = (str) => {
            const dateArr = str.split('/');
            if (dateArr.length === 3) {
                return new Date(`${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`)
            }
            return new Date();
        }

        const hoursDayArray = this.getHoursDayArray();
        const workDays = hoursDayArray.hours
            .filter(cellValue => Number(cellValue))
            .filter(day => this.isNotWeekend(day, toUsDate(calendarCurrentMonthYearString)))
            .length;

        const exceptionArray = ['חופשה', 'מחלה', 'חג', 'מילואים']

        const exceptionsDays = hoursDayArray.data
            .filter(cellValue => exceptionArray.indexOf(cellValue.trim()) > -1)
            .length

        return (workDays - exceptionsDays) * 9 * 60;

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