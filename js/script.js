var usernameSettings = {
    "async": true,
    "crossDomain": true,
    "url": "https://financialtracker-407b.restdb.io/rest/usernames",
    "method": "GET",
    "headers": {
        "content-type": "application/json",
        "x-apikey": "5ff2b985823229477922c6e2",
        "cache-control": "no-cache"
        }
    }
    
    $.ajax(usernameSettings).done(function (response) {
        console.log(response);
});

var userID = null;

function signupGetValue(){
    var signupUsername = document.getElementById("su-username").value;
    var signupEmail = document.getElementById("su-email").value;
    var signupPassword = document.getElementById("su-password").value;
    $.ajax(usernameSettings).done(function(response) {
        for(i = 0; i < response.length; i++){
            if (signupUsername == response[i].Username){
                console.log("Username already exist!");
                return;
            } else if (signupEmail == response[i].AccountDetails[0].Email) {
                console.log("Email already exist!");
                return;
            }
            if (i+1 == response.length){
                // #TODO: Create Account
                console.log("Create New Account");
            }
        }
    });
}

function signinGetValue(){
    function accountCheckFunction(item, index) {
        if (signupUsername == item.Username && signupPassword == item.AccountDetails[0].Password){
            console.log("Success");
            window.userID = index;
            window.localStorage.setItem("AccountInfo", String(item));
            return;
        } else {
            console.log("Fail");
        }
    }
    var signupUsername = document.getElementById("su-username").value;
    var signupPassword = document.getElementById("su-password").value;
    $.ajax(usernameSettings).done(function (response) {
        response.forEach(accountCheckFunction);
    });
}