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
    };
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
        if (response.length == 0) {
            alert("An Error Has Occured. Returning back to main page.");
            window.location.replace('../html/index.html');
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

function resetChartTable() {
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
        var slicesForChart = {};
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
            if (ADFI.Others != 0) { counter++; }
            if (ADFI.Savings > 0) {
                slicesForChart[counter.toString()] = { "offset": offsetAmount };
            }

        }
        function loadGraphData() {
            if (counter == 0) {
                var data = google.visualization.arrayToDataTable([
                    ['Category', 'Amount Spent ($)'], ["No Data Found\nStart Adding Data Now!", 1]]);
                return data;
            } else if (JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Savings > 0) {
                var data = google.visualization.arrayToDataTable([
                    ['Category', 'Amount Spent ($)'],
                    ['Transport', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Transport],
                    ['Shopping', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Shopping],
                    ['Entertainment', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Entertainment],
                    ['Food', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Food],
                    ['Others', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Others],
                    ['Savings', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Savings]
                ]);
                return data;
            } else {
                var data = google.visualization.arrayToDataTable([
                    ['Category', 'Amount Spent ($)'],
                    ['Transport', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Transport],
                    ['Shopping', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Shopping],
                    ['Entertainment', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Entertainment],
                    ['Food', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Food],
                    ['Others', JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Others]
                ]);

                return data;
            }
        }
        data = loadGraphData();
        if (visualViewport.width > 1024) {
            var options = {
                title: 'My Financial Tracker',
                backgroundColor: 'white',
                titleTextStyle: { fontSize: 24 * visualViewport.width / 1920 },
                legend: { textStyle: { fontSize: 24 * visualViewport.width / 1920 }, alignment: "center" },
                chartArea: { width: "100%", height: "80%" },
                height: "10%",
                slices: slicesForChart
            };
        }
        else if (visualViewport.width > 768) {
            var options = {
                title: 'My Financial Tracker',
                backgroundColor: 'white',
                titleTextStyle: { fontSize: 36 * visualViewport.width / 1920 },
                legend: { textStyle: { fontSize: 36 * visualViewport.width / 1920 }, alignment: "center" },
                chartArea: { width: "100%", height: "80%" },
                height: "10%",
                slices: slicesForChart
            };
        } else {
            var options = {
                title: 'My Financial Tracker',
                backgroundColor: 'white',
                titleTextStyle: { fontSize: 64 * visualViewport.width / 1920 },
                legend: { textStyle: { fontSize: 64 * visualViewport.width / 1920 }, alignment: "center" },
                chartArea: { width: "100%", height: "80%" },
                height: "10%",
                slices: slicesForChart
            };
        }
        document.getElementById("piechart-placeholder").style.display = "none";
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        document.getElementById("ft-piechart").style.display = "flex";
        chart.draw(data, options);
        google.visualization.events.addListener(chart, 'ready', titleCenter(options));
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
    document.getElementById("ft-income").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Income;
    document.getElementById("ft-transport").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Transport;
    document.getElementById("ft-shopping").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Shopping;
    document.getElementById("ft-entertainment").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Entertainment;
    document.getElementById("ft-food").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Food;
    document.getElementById("ft-others").value = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Others;
}

function submitData() {
    document.getElementById("submitDataButton").disabled = true;
    var newIncome = document.getElementById("ft-income").value;
    var newTransport = document.getElementById("ft-transport").value;
    var newShopping = document.getElementById("ft-shopping").value;
    var newEntertainment = document.getElementById("ft-entertainment").value;
    var newFood = document.getElementById("ft-food").value;
    var newOthers = document.getElementById("ft-others").value;
    var ajaxSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://financialtracker-407b.restdb.io/rest/finance/" + JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0]._id,
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "5ff2b985823229477922c6e2",
            "cache-control": "no-cache"
        }
    };
    $.ajax(ajaxSettings).done(function (response) {
        var recentTransactions = response.RecentTransactions;
        var d = new Date();
        var newEdits = "";
        if (newIncome != JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Income) {
            newEdits += `${d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear()}\tChanged Income/Budget from ${JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Income} to ${newIncome}\n`;
        }
        if (newTransport != JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Transport) {
            newEdits += `${d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear()}\tChanged Transport from ${JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Transport} to ${newTransport}\n`;
        }
        if (newShopping != JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Shopping) {
            newEdits += `${d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear()}\tChanged Shopping from ${JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Shopping} to ${newShopping}\n`;
        }

        if (newEntertainment != JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Entertainment) {
            newEdits += `${d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear()}\tChanged Entertainment from ${JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Entertainment} to ${newEntertainment}\n`;
        }

        if (newFood != JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Food) {
            newEdits += `${d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear()}\tChanged Food from ${JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Food} to ${newFood}\n`;
        }

        if (newOthers != JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Others) {
            newEdits += `${d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear()}\tChanged Others from ${JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Others} to ${newOthers}\n`;
        }
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
            "data": JSON.stringify({
                Income: Number(newIncome),
                Transport: Number(newTransport),
                Shopping: Number(newShopping),
                Entertainment: Number(newEntertainment),
                Food: Number(newFood),
                Others: Number(newOthers),
                RecentTransactions: recentTransactions + newEdits
            })
        };
        $.ajax(ajaxSettings).done(function (response) {
            document.getElementById("submitDataButton").disabled = false;
            closeDataWindow();
            loadDataFromServer();
        });
    });
}

function titleCenter(options) {
    var $container = $('#piechart');
    var svgWidth = $container.find('svg').width();
    var $titleElem = $container.find("text:contains(" + options.title + ")");
    var titleWidth = $titleElem.html().length * ($titleElem.attr('font-size') / 2);
    var xAxisAlign = (svgWidth - titleWidth) / 2;
    $titleElem.attr('x', xAxisAlign);
}

var currentwidth = null;
var responsiveChart = function () {
    if (visualViewport.width != currentwidth) {
        window.currentwidth = visualViewport.width;
        loadChartTable();
    }
};

setInterval(responsiveChart, 1);

function openEditWindow() {
    document.getElementById("viewEditWindow").style.display = "block";
    var ajaxSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://financialtracker-407b.restdb.io/rest/finance/" + JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0]._id,
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "5ff2b985823229477922c6e2",
            "cache-control": "no-cache"
        }
    };
    $.ajax(ajaxSettings).done(function (response) {
        var recentTransactions = response.RecentTransactions;
        var recentEdits = recentTransactions.split("\n");
        recentEdits.pop();
        var lastFiveEdits = recentEdits.slice(Math.max(recentEdits.length - 6, 0));
        lastFiveEdits.reverse();
        for (var i = 0; i < lastFiveEdits.length; i++) {
            var infoSeperator = lastFiveEdits[i].split("\t");
            document.getElementById("editListDate").innerHTML += infoSeperator[0] + "<br>";
            document.getElementById("editListContent").innerHTML += infoSeperator[1] + "<br>";
        }
    });
}

function closeEditWindow() {
    document.getElementById("viewEditWindow").style.display = "none";
    document.getElementById("editListDate").innerHTML = "";
    document.getElementById("editListContent").innerHTML = "";
}

window.onclick = function (event) {
    if (event.target == document.getElementById("viewEditWindow")) {
        document.getElementById("viewEditWindow").style.display = "none";
    }
};


var reloadData = function () {
    var income = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Income;
    var totalSpent = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Total;
    if (income == 0 && totalSpent == 0) {
        document.getElementById("ft-income-p").innerHTML = "There";
        document.getElementById("ft-income-value").innerHTML = "Is";
        document.getElementById("ft-totalspent-p").innerHTML = "No";
        document.getElementById("ft-totalspent-value").innerHTML = "Data";
        document.getElementById("ft-leftover-p").innerHTML = "Add";
        document.getElementById("ft-leftover-value").innerHTML = "Now!";
    } else {
        document.getElementById("ft-income-p").innerHTML = "Income/Budget($):";
        document.getElementById("ft-income-value").innerHTML = income;
        document.getElementById("ft-totalspent-p").innerHTML = "Amount Spent($):";
        document.getElementById("ft-totalspent-value").innerHTML = totalSpent;
        if (JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Savings >= 0) {
            document.getElementById("ft-leftover-p").innerHTML = "Savings($):";
            document.getElementById("ft-leftover-value").innerHTML = JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Savings;
        } else if (JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Savings < 0) {
            document.getElementById("ft-leftover-p").innerHTML = "Overspent Amount($):";
            document.getElementById("ft-leftover-value").innerHTML = Math.abs(JSON.parse(localStorage.getItem("AccountInfo")).FinanceInfo[0].Savings);
        }
    }
}
setInterval(reloadData, 1000);
setInterval(loadDataFromServer, 10000);