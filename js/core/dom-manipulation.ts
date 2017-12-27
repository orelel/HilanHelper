declare var $;
const CURRENT_MONTH_SELECTOR = '#ctl00_mp_currentMonth';
const CALENDAR_CONTAINER_SELECTOR = '#ctl00_mp_calendarUpdator'

enum CalendarData {
    HOURS = 1,
    TEXT = 2
}

class DomManipulation {

    public static watchElement(pageContent, selector, callbackFn) {
        
        // Options for the observer (which mutations to observe)
        var config = { attributes: true, childList: true, subtree:true };

        // Callback function to execute when mutations are observed
        var callback = function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    callbackFn();
                }               
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe($(pageContent.querySelector(selector))[0], config);
    }

    public static getCurrentMonthAndYear(pageContent){
        return pageContent.querySelector(CURRENT_MONTH_SELECTOR).value;
    }

    public static getIframeContent() {
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

    public static printMyStats(pageContent, options) {
        $(pageContent).find('#legendPlace .my-stats').empty();
        $(pageContent).find('#legendPlace').append(
            `<div class='my-stats'>
                <h3>נתוני החודש</h3>
                <ul>
                    <li class='current-month'>
                        <span>חודש</span>
                        <span>${options.currentMonth}</span>
                    </li>
                    <li class='should-work-hours'>
                        <span>שעות תקן</span>
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

    public static getCalendarMonthData(pageContent, index: CalendarData) {
        const arr = [];
        [].forEach.call(pageContent.querySelectorAll(`#calendar_container tr:nth-child(n+3) tr:nth-child(${index}) td:nth-child(1)`), (elem) => {
            arr.push($(elem).text())
        });
        return arr;
    }
}