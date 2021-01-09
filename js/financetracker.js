var AccountData = null;
var userID = null;
//Check that Data exist in order to continue.
function loadData() {
    window.AccountData = localStorage.getItem("AccountInfo");
    if (window.AccountData == null) {
        alert("An Error Has Occured. Returning back to main page.");
        window.location.replace('../html/index.html');
    }
    else {
        window.AccountDataParsed = JSON.parse(AccountData);
        loadDataFromServer();
    }
}

//Load Data ID From Server
function loadDataFromServer() {
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
        for (i = 0; i < response.length; i++) {
            if (response[i]._id == JSON.parse(AccountData)._id) {
                window.userID = JSON.parse(AccountData)._id;
                setInterval(checkLocalData(), 1);
                loadChartTable();
                break;
            } else {
                if (i + 1 == response.length) {
                    alert("An Error Has Occured. Returning back to main page.");
                    window.location.replace('../html/index.html');
                }
            }
        }
    });
}

//Check That Data Doesn't Disappear (or) replaced.
function checkLocalData() {
    if (JSON.parse(AccountData)._id != userID) {
        alert("An Error Has Occured. Returning back to main page.");
        window.location.replace('../html/index.html');
    }
}


function loadChartTable() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var ADFI = JSON.parse(AccountData).FinanceInfo[0];
        var mostSpent = Math.max(ADFI.Transport, ADFI.Shopping, ADFI.Entertainment, ADFI.Food, ADFI.Others);
        var slicesForChart = {}
        var counter = 0;
        var offsetAmount = 0.05;
        if (mostSpent != 0) {
            if (ADFI.Transport == mostSpent) {
                slicesForChart[counter.toString()] = { "offset": offsetAmount };
            }
            if (ADFI.Transport != 0) { counter++; }
            if (ADFI.Shopping == mostSpent) {
                slicesForChart[counter.toString()] = { "offset": offsetAmount };
            }
            if (ADFI.Shopping != 0) { counter++; }
            if (ADFI.Entertainment == mostSpent) {
                slicesForChart[counter.toString()] = { "offset": offsetAmount };
            }
            if (ADFI.Entertainment != 0) { counter++; }
            if (ADFI.Food == mostSpent) {
                slicesForChart[counter.toString()] = { "offset": offsetAmount };
            }
            if (ADFI.Food != 0) { counter++; }
            if (ADFI.Others == mostSpent) {
                slicesForChart[counter.toString()] = { "offset": offsetAmount };
            }
        }
        function loadGraphData() {
            if (counter == 0) {
                var data = google.visualization.arrayToDataTable([
                    ['Category', 'Amount Spent ($)'], ["No Data Found\nStart Adding Data Now!", 1]]);
            } else {
                var data = google.visualization.arrayToDataTable([
                    ['Category', 'Amount Spent ($)'],
                    ['Transport', JSON.parse(AccountData).FinanceInfo[0].Transport],
                    ['Shopping', JSON.parse(AccountData).FinanceInfo[0].Shopping],
                    ['Entertainment', JSON.parse(AccountData).FinanceInfo[0].Entertainment],
                    ['Food', JSON.parse(AccountData).FinanceInfo[0].Food],
                    ['Others', JSON.parse(AccountData).FinanceInfo[0].Others]
                ]);
            }
            return data;
        }
        data = loadGraphData();
        var options = {
            title: 'My Financial Tracker',
            pieHole: 0.3,
            backgroundColor: 'white',
            slices: slicesForChart
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }
}

function logOut(){
    window.localStorage.clear();
    window.location.replace("../html/logout.html");
}