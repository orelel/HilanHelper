var CalendarData;
(function (CalendarData) {
    CalendarData[CalendarData["HOURS"] = 1] = "HOURS";
    CalendarData[CalendarData["TEXT"] = 2] = "TEXT";
})(CalendarData || (CalendarData = {}));
class DomManipulation {
    static printMyStats(pageContent, options) {
        $(pageContent).find('#legendPlace .my-stats').empty();
        $(pageContent).find('#legendPlace').append(`<div class='my-stats'>
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
             </div>`);
    }
    static getCalendarMonthData(pageContent, index) {
        const arr = [];
        [].forEach.call(pageContent.querySelectorAll(`#calendar_container tr:nth-child(n+3) tr:nth-child(${index}) td:nth-child(1)`), (elem) => {
            arr.push($(elem).text());
        });
        return arr;
    }
}
DomManipulation.getIframeContent = () => {
    var dfd = $.Deferred();
    $(document).ready(() => {
        const iframe = document.querySelector('#mainIFrame');
        if (!iframe) {
            dfd.resolve(document);
        }
        else {
            iframe.onload = () => {
                dfd.resolve(iframe.contentDocument || iframe.contentWindow.document);
            };
        }
    });
    return dfd.promise();
};
DomManipulation.addButtonListener = (pageContent, selector, callbackFn) => {
    $(pageContent.querySelector(selector)).ready(() => {
        $(pageContent.querySelector(selector)).on('click', callbackFn);
    });
};
//# sourceMappingURL=dom-manipulation.js.map