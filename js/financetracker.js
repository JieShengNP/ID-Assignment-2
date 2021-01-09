var userID = null;
//Check that Data exist in order to continue.
function loadData() {
    if (localStorage.getItem("AccountInfo") == null) {
        alert("An Error Has Occured. Returning back to main page.");
        window.location.replace('../html/index.html');
    }
    else {
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
            if (response[i]._id == JSON.parse(localStorage.getItem("AccountInfo"))._id) {
                window.userID = JSON.parse(localStorage.getItem("AccountInfo"))._id;
                setInterval(checkLocalData(), 1);
                window.localStorage.setItem("AccountInfo", JSON.stringify(response[i]));
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
    if (JSON.parse(localStorage.getItem("AccountInfo"))._id != userID) {
        alert("An Error Has Occured. Returning back to main page.");
        window.location.replace('../html/index.html');
    }
}

function resetChartTable(){
    document.getElementById("ft-piechart").innerHTML = '<div id="piechart"></div>';
    document.getElementById("piechart-placeholder").style.display = "flex";
}

function loadChartTable() {
    resetChartTable();
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var ADFI = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0];
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
                    ['Transport', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Transport],
                    ['Shopping', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Shopping],
                    ['Entertainment', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Entertainment],
                    ['Food', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Food],
                    ['Others', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Others]
                ]);
            }
            return data;
        }
        data = loadGraphData();
        var options = {
            title: 'My Financial Tracker',
            pieHole: 0.3,
            backgroundColor: 'white',
            titleTextStyle: {fontSize: 24},
            slices: slicesForChart
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        document.getElementById("piechart-placeholder").style.display = "none";
        chart.draw(data, options);
    }
}

function logOut() {
    window.localStorage.clear();
    window.location.replace("../html/logout.html");
}

function closeDataWindow() {
    document.getElementById("editDataWindow").style.display = "none";
}

function openDataWindow() {
    document.getElementById("editDataWindow").style.display = "block";
    document.getElementById("ft-transport").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Transport;
    document.getElementById("ft-shopping").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Shopping;
    document.getElementById("ft-entertainment").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Entertainment;
    document.getElementById("ft-food").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Food;
    document.getElementById("ft-others").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Others;
}

function submitData() {
    var newTransport = document.getElementById("ft-transport").value;
    var newShopping = document.getElementById("ft-shopping").value;
    var newEntertainment = document.getElementById("ft-entertainment").value;
    var newFood = document.getElementById("ft-food").value;
    var newOthers = document.getElementById("ft-others").value;
    var ajaxSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://financialtracker-407b.restdb.io/rest/finance/" + JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0]._id,
        "method": "PUT",
        "headers": {
            "x-apikey": '5ff2b985823229477922c6e2',
            "content-type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify({ Transport: Number(newTransport), Shopping: Number(newShopping), Entertainment: Number(newEntertainment), Food: Number(newFood), Others: Number(newOthers) })
    }
    $.ajax(ajaxSettings).done(function (response) {
        closeDataWindow();
        loadDataFromServer();
    });
}