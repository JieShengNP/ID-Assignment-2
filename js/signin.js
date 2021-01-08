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
var db = new restdb("5ff2b985823229477922c6e2");
var userID = null;
var userFID = null;
var userAID = null;
var existingUsername = null;

function signinGetValue() {

    //https://www.youtube.com/watch?v=CJ5bWfp3coM


    var signupUsername = document.getElementById("su-username").value.toUpperCase();
    var signupPassword = document.getElementById("su-password").value;
    $.ajax(usernameSettings).done(function (response) {
        for (i = 0; i < response.length; i++) {
            if (signupUsername == response[i].Username && signupPassword == response[i].AccountDetails[0].Password) {
                console.log("Success");
                window.userID = response[i]._id;
                if (window.localStorage.getItem("AccountInfo")) {
                    window.localStorage.removeItem("AccountInfo");
                }
                window.localStorage.setItem("AccountInfo", JSON.stringify(response[i]));
                $(".sbutton").addClass("button-success");
                setTimeout(function () {
                    window.location.href = "../html/financetracker.html";
                }, 3000);
                break;
            } else if ((i + 1) == response.length) {
                $(".sbutton").removeClass("button-active");
                $(".sbutton").removeClass("button-success");
                $('.si-incorrect').css("opacity", "1");
            }
        }
    });
}