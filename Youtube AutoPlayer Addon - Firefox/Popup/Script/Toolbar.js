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

let Reset_Count = document.getElementById('Reset');
Reset_Count.onclick = function(){
	if (confirm("Warning: this will reset the count to 0.This is irreversible. \n			Are you sure?")){
		let value = "0";
		let SettingCookies = browser.cookies.set({
			url: "https://www.youtube.com/",
			name: "YouTube_AutoPlayer",
			value: value
		});
	}
};

browser.cookies.onChanged.addListener(function(changeInfo) {
  console.log('Cookie changed: ' +
              '\n * Cookie: ' + JSON.stringify(changeInfo.cookie) +
              '\n * Cause: ' + changeInfo.cause +
              '\n * Removed: ' + changeInfo.removed);
});