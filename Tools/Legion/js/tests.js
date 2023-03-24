// Test functions

async function CreateUsers(userNumber) {
    for (let i = 0; i < userNumber; i++) {
        allUsers.push(new User());
    }
    OnRefresh();
}
function AllPing() { allUsers.forEach(u => u.Ping()); }
function AllSignin() { allUsers.forEach(u => u.Signin()); }
function AllLogin() { allUsers.forEach(u => u.Login()); }
function AllGetInternalData() { allUsers.forEach(u => u.GetInternalData()); }
function GetInternalDataAndPrint() { if (allUsers.length > 0) allUsers[0].GetInternalData(true); }
function AllAddActivity() { allUsers.forEach(u => u.AddActivity()); }