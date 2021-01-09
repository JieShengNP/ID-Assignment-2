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
var salt = "JavaScript!"

function signupGetValue() {
    var signupUsername = document.getElementById("su-username").value.toUpperCase();
    var signupEmail = document.getElementById("su-email").value.toUpperCase();
    var signupPassword = document.getElementById("su-password").value;
    var encryptedPassword = (CryptoJS.SHA1(signupPassword+salt));
    $.ajax(usernameSettings).done(function (response) {
        for (i = 0; i < response.length; i++) {
            if (signupUsername == response[i].Username) {
                $(".sbutton").removeClass("button-active");
                $(".sbutton").removeClass("button-success");
                $('p#su-un-taken').css("opacity", "1");
                existingUsername = signupUsername;
                var checkUsername = setInterval(function () {
                    if (document.getElementById("su-username").value.toUpperCase() != existingUsername) {
                        $('p#su-un-taken').css("opacity", "0");
                        clearInterval(checkUsername);
                    }
                }, 100);
                break;
            }
            if (signupEmail == response[i].AccountDetails[0].Email) {
                $(".sbutton").removeClass("button-active");
                $(".sbutton").removeClass("button-success");
                $('p#su-un-taken').css("opacity", "1");
                existingEmail = signupEmail;
                var checkEmail = setInterval(function () {
                    if (document.getElementById("su-email").value.toUpperCase() != existingEmail) {
                        $('p#su-em-taken').css("opacity", "0");
                        clearInterval(checkEmail);
                    }
                }, 100);
                break;
            }
            if (i + 1 == response.length) {
                //Create Accounts Database
                var ajaxSettings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://financialtracker-407b.restdb.io/rest/accounts",
                    "method": "POST",
                    "headers": {
                        "x-apikey": '5ff2b985823229477922c6e2',
                        "content-type": "application/json"
                    },
                    "processData": false,
                    "data": JSON.stringify({ Email: signupEmail, Password: encryptedPassword })
                }
                $.ajax(ajaxSettings).done(function (response) {
                    console.log(response);
                    window.userAID = response._id;
                    //Create Default Finance Database
                    var ajaxSettings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://financialtracker-407b.restdb.io/rest/finance",
                        "method": "POST",
                        "headers": {
                            "x-apikey": '5ff2b985823229477922c6e2',
                            "content-type": "application/json"
                        },
                        "processData": false,
                        "data": JSON.stringify({ Transport: 0, Shopping: 0, Entertainment: 0, Food: 0, Others: 0 })
                    }
                    $.ajax(ajaxSettings).done(function (response) {
                        console.log(response);
                        window.userFID = response._id;
                        //Create Usernames Database to contain everything
                        var ajaxSettings = {
                            "async": true,
                            "crossDomain": true,
                            "url": "https://financialtracker-407b.restdb.io/rest/usernames",
                            "method": "POST",
                            "headers": {
                                "x-apikey": '5ff2b985823229477922c6e2',
                                "content-type": "application/json"
                            },
                            "processData": false,
                            "data": JSON.stringify({ Username: signupUsername, AccountDetails: [userAID], FinanceInfo: [userFID] })
                        }
                        $.ajax(ajaxSettings).done(function (response) {
                            console.log(response);
                            window.userID = response._id;
                            if (window.localStorage.getItem("AccountInfo")) {
                                window.localStorage.removeItem("AccountInfo");
                            }
                            $.ajax(usernameSettings).done(function (response) {
                                for (i = 0; i < response.length; i++) {
                                    if (signupUsername == response[i].Username && encryptedPassword == response[i].AccountDetails[0].Password) {
                                        window.localStorage.setItem("AccountInfo", JSON.stringify(response[i]));
                                    }
                                }
                            });
                            $(".sbutton").addClass("button-success");
                            setTimeout(function () {
                                window.location.href = "../html/financetracker.html";
                            }, 3000);
                        })
                    })
                })
            }
        }
    });
}

function clearLocalData(){
    window.localStorage.clear();
}