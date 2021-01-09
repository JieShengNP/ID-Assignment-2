var AccountData = null;

function loadData(){
    window.AccountData = localStorage.getItem("AccountInfo");
    if (window.AccountData == null){
        alert("An Error Has Occured. Returning back to main page.");
        window.location.replace('../html/index.html');
    }
}
