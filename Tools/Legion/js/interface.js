var elUsers = document.getElementById('users');
var elSelectUserNumber = document.getElementById('select-user-number');
var elSelectActivityNumber = document.getElementById('select-activity-number');
var elButtonGlobalTest = document.getElementById('button-global-test');

var lbRequestsNumber = document.getElementById('requests-number');
var lbErrorsNumber = document.getElementById('errors-number');
var lbTotalTime = document.getElementById('total-time');
var lbUserNumber = document.getElementById('user-number');
var lbRequestMin = document.getElementById('requests-min');
var lbRequestMax = document.getElementById('requests-max');
var lbRequestAvrg = document.getElementById('requests-average');

var USER_EMPTY = `
    <div class="row"><p>ID:</p><p class="device-id"></p></div>
    <div class="row"><p>Name:</p><p class="device-name"></p></div>
    <div class="row"><p>Requests:</p><p class="nb-requests">0</p></div>
    <div class="row"><p>Activities:</p><p class="nb-activities">0</p></div>
    <div class="row"><p>Max req. time:</p><p class="nb-max">0</p></div>
    <div class="row"><p>Min req. time:</p><p class="nb-min">0</p></div>
    <div class="row"><p>Avrg req. time:</p><p class="nb-average">0</p></div>
`;

function UpdateInterface() {
    let allRequests = 0;
    for (let i = 0; i < users.length; i++) {
        allRequests += users[i].timesOfRequests.length;
    }
    lbRequestsNumber.innerText = allRequests;
    lbErrorsNumber.innerText = errors.length;

    let elapsedTime = 0;
    if (TIME_START !== 0 && TIME_END !== 0) {
        elapsedTime = Math.floor((TIME_END - TIME_START)) / 1000;
    } else if (TIME_START !== 0) {
        elapsedTime = Math.floor((performance.now() - TIME_START)) / 1000;
    }
    lbTotalTime.innerText = elapsedTime + 's';

    const timesOfRequests = users.map(user => ([...user.timesOfRequests])).flat();
    let reqMin = 0;
    let reqMax = 0;
    let reqAerage = 0;
    if (timesOfRequests.length) {
        const reqSum = timesOfRequests.reduce((a, b) => a + b, 0);
        reqMin = Math.min(...timesOfRequests);
        reqMax = Math.max(...timesOfRequests);
        reqAerage = Math.floor(reqSum / timesOfRequests.length);
    }
    lbUserNumber.innerText = users.length;
    lbRequestMin.innerText = reqMin;
    lbRequestMax.innerText = reqMax;
    lbRequestAvrg.innerText = reqAerage;
}