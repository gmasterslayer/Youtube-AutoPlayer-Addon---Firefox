/* Retrieve any previously set cookie and send to content script */
// get any previously set cookie for the current tab 
function cookieUpdate() {
    let gettingCookies = browser.cookies.get({
        url: "https://www.youtube.com/",
        name: "YouTube_AutoPlayer"
    });
    gettingCookies.then((cookie) => {
        if (cookie) {
            let p = document.getElementById('autoplayed');
            if (parseInt(cookie.value) == 0) {
                var smilely = '<p style="text-align:center"> :(</p>';
            } else {
                var smilely = '<p style="text-align:center"> :)</p>';
            }
            p.innerHTML = "Youtube Autoplayer has autoplayed " + cookie.value + " times" + smilely;
        } else {
            p.innerHTML = "No previous autorun instances";
        }
    });
}
setInterval(cookieUpdate, 500);