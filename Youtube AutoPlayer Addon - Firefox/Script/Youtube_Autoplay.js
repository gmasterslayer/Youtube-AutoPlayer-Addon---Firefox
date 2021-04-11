var delay = 1500;
var ran = false;
let debug = false;
let reset = false;
var autoplays = 0;
if (debug) {
    alert("No syntax errors. Injection successful");
}
if (getCookie("YouTube_AutoPlayer") == null) {
    setCookie("YouTube_AutoPlayer", 0, 999); //creates cookie with 0 autoplays saved
    if (debug) {
        alert("Cookie Set");
    }
} else { //reads the cookies and recovers the statistics value for autoplays
    if (reset) {
        setCookie("YouTube_AutoPlayer", 0, 999);
    }
    autoplays = parseInt(getCookie("YouTube_AutoPlayer")); //convert the returning string into integer. broke shit last time
    if (debug) {
        alert("Cookie found and variables set. Record found " + autoplays + " autoplays.");

    }
}
var everythingLoaded = setInterval(function() { //checks the dom if everything is loaded
    //could be depricated with the use of the manifest
    if (/loaded|complete/.test(document.readyState)) {
        clearInterval(everythingLoaded);
        var title = document.getElementsByTagName("TITLE")[0];
        title = title.innerHTML;
        if (title.search("YouTube") != -1) {
            var test = setInterval(Checker, delay);
            cookieUpdate();
            //setTimeout(repeat, time);
        }
    }
}, delay * 0.67);

function Checker() {
    if (ran != true) {
        ran = true;
        console.log("YouTube_AutoPlayer Status: Working");
    }
    let arr = Array.from(document.querySelectorAll('.ytd-popup-container'));
    var elem = arr[1]; // the popup
    if (elem != null | undefined) {
        document.getElementById('text').click();
        /*youtube uses an element generator. The for each loop is needed
        to remove the generator which is what the arr array is. BUG FIXED*/
        arr.forEach((arrvalue, index) => {
            arrvalue.parentNode.removeChild(arr[index]);
        });
        autoplays += 1;
        setCookie("YouTube_AutoPlayer", autoplays, 999);
        elem = undefined; // unset
        //delete(elem); // this removes the variable completely | doesnt seem to be working
    }
}

function setCookie(c_name, value, expiredays) { //sets cookie for statistics popup
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + value + ";path=/" + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(name) { //reads statisics from cookie
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null; //no statistics saved
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}