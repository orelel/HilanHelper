declare const chrome;
document.addEventListener('DOMContentLoaded', function () {
    (document.getElementById('work-hours-input') as any).defaultValue = "9"
    document.getElementById('work-hours-input').addEventListener('change', onHoursChanged);

});

function onHoursChanged(event) {
    const workHours = event.target.value;
    console.log(`this is work hours: ${workHours}`);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(`tabs[0]: ${tabs[0]}`);
        chrome.tabs.sendMessage(tabs[0].id,
            { user_work_hours_in_day: Number(workHours) }
        );
    });

}