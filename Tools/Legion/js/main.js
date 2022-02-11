/**
 * @description List of all the users
 * @type {Array<User>}
 */
var users = [];

/**
 * @description All errors messages
 * @type {Array<String>}
 */
var errors = [];

/**
 * @description If false, skip all requests
 * @type {Boolean}
 */
var alive = true;

var USERS_NUMBER = 250;
var USERS_ENDS = 0;
var TIME_START = 0;
var TIME_END = 0;
function TestAll() {
    if (users.length) {
        AddError('TestAll() should be called before creating users');
        return;
    }
    const usersNumber = parseInt(elSelectUserNumber.value);
    const activitiesNumber = parseInt(elSelectActivityNumber.value);
    if (isNaN(usersNumber) || isNaN(activitiesNumber)) {
        AddError('TestAll() should be called with a number');
        return;
    }

    TIME_END = 0;
    USERS_NUMBER = usersNumber;
    elSelectActivityNumber.disabled = true;
    elSelectUserNumber.disabled = true;
    elButtonGlobalTest.onclick = TestAllEnd;
    elButtonGlobalTest.innerHTML = 'Stop';

    TIME_START = performance.now();
    users = Array(USERS_NUMBER).fill(0).map(() => new User());
    users.forEach(u => u.TestAll(activitiesNumber));
}
function TestAllEnd() {
    TIME_END = performance.now();

    alive = false;
    elButtonGlobalTest.innerHTML = 'Delete all';
    elButtonGlobalTest.onclick = Clear;
    elSelectActivityNumber.disabled = false;
    elSelectUserNumber.disabled = false;
}
elButtonGlobalTest.onclick = TestAll;

async function Clear() {
    if (!users.length) {
        AddError('All users are already deleted');
        return;
    }
    elButtonGlobalTest.disabled = true;

    // Delete all users & accounts
    for (let i = 0; i < users.length; i++) {
        await users[i].DeleteAccount();
    }

    elButtonGlobalTest.disabled = false;
    elButtonGlobalTest.innerHTML = 'Start test';
    elButtonGlobalTest.onclick = TestAll;
    elSelectActivityNumber.disabled = false;
    elSelectUserNumber.disabled = false;
}