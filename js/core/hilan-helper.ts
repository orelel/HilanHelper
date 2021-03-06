
class HilanHelper {
    private pageContent;   

    constructor() {
        this.init();
        this.addSettingsEventListener();
       
    }
    private async init() {
        try {
            this.pageContent = await DomManipulation.getIframeContent();            
            this.getCalendarCalculatedData();
            DomManipulation.watchElement(this.pageContent, CALENDAR_CONTAINER_SELECTOR,this.getCalendarCalculatedData);
        }
        catch (err) {
            console.log(`oops! some error occured: ${err}`);
        }
    }

    private getCalendarCalculatedData = () => {

        const calendarCurrentMonthYear = DomManipulation.getCurrentMonthAndYear(this.pageContent);
        const totalWorkHours = TimeCalculation.getTotalWorkHoursInMinutes(this.pageContent);
        const totalShouldWorkHours = TimeCalculation.getTotalShouldWorkHoursInMinutes(this.pageContent, calendarCurrentMonthYear);
        const missingHours = totalShouldWorkHours - totalWorkHours;
        const avarageHoursLeftPerDay = TimeCalculation.getAvarageHoursPerDay(this.pageContent, calendarCurrentMonthYear);
       

        DomManipulation.printMyStats(this.pageContent, {
            currentMonth: calendarCurrentMonthYear,
            shouldWorkHours: Utility.getHoursMinutesFormat(totalShouldWorkHours),
            workHours: Utility.getHoursMinutesFormat(totalWorkHours),
            missingHours: Utility.getHoursMinutesFormat(missingHours),
            averageHoursPerDay: Utility.getHoursMinutesFormat(avarageHoursLeftPerDay)
        });
    }    

    private addSettingsEventListener = () =>{
        console.log('adding message listener');
        chrome.runtime.onMessage.addListener((request) => {
            console.log('i\'m in message listener');
            if(request.user_work_hours_in_day){
                TimeCalculation.DEFAULT_WORK_HOURS_IN_DAY = request.user_work_hours_in_day;
                this.getCalendarCalculatedData();
            }
        });
    }



 







}