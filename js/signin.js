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
};

var salt = "JavaScript!";

function signinGetValue() {
    var signupUsername = document.getElementById("su-username").value.toUpperCase();
    var signupPassword = document.getElementById("su-password").value;
    var encryptedPassword = CryptoJS.SHA1(signupPassword + salt).toString();
    $.ajax(usernameSettings).done(function (response) {
        for (i = 0; i < response.length; i++) {
            if (signupUsername == response[i].Username && encryptedPassword == response[i].AccountDetails[0].Password) {
                window.userID = response[i]._id;
                if (window.localStorage.getItem("AccountInfo")) {
                    window.localStorage.removeItem("AccountInfo");
                }
                window.localStorage.setItem("AccountInfo", JSON.stringify(response[i]));
                $(".sbutton").addClass("button-success");
                setTimeout(function () {
                    window.location.href = "../html/financetracker.html";
                }, 1000);
                break;
            } else if ((i + 1) == response.length) {
                setTimeout(function () {
                    $(".sbutton").removeClass("button-active");
                    $('.si-incorrect').css("opacity", "1");
                }, 1000);
            }
        }
    });
}

function clearLocalData() {
    window.localStorage.clear();
}