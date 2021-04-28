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
		let title = document.getElementsByTagName("TITLE")[0];
		let url = window.location.href;
		title = title.innerHTML;
		if (title.search("YouTube") != -1 && url.search("watch") > -1) {
			var CheckerTimer = setInterval(Checker, delay);
			//setTimeout(repeat, time);
		}
	}
}, delay * 0.67);
/*
"style-scope ytd-popup-container" = <yt-notification-action-renderer = index 0, <tp-yt-paper-dialog = index 1, <yt-confirm-dialog-renderer = index 2
"ytp-play-button ytp-button" = class name for play button in button elements
'.ytd-popup-container' = class name for popupcontainer */
function Checker() {
	if (!ran) {
		ran = true;
		console.log("YouTube_AutoPlayer Status: Working");
		setTimeout(New_Player(true), 5000);
	}
	let arr = Array.from(document.querySelectorAll('.ytd-popup-container'));
	var elem = arr[1]; // the popup
	if (elem != null | undefined) {
		New_Player();
		document.getElementById('text').click(); //text is the popup nag and this clicks the yes button
		try {
			arr[1].remove(); //removes the container. fixes the bug causes false positive detections of the popup
			arr[0].remove();
		} catch(error) {
			console.log("ERROR: Failed to remove " + error);
		}
		if (autoplays == parseInt(getCookie("YouTube_AutoPlayer"))) { //done to avoid desync from autoplays reset
			Set_AutoPlays();
		} else {
			getCookie("YouTube_AutoPlayer");
			autoplays = parseInt(getCookie("YouTube_AutoPlayer"));
			Set_AutoPlays();
		}
		arr = Array.from(document.querySelectorAll('video'));
		setTimeout(New_Player(), 15000); //sometimes youtube reloads and will freeze the video. This ensures the next video is not paused
		elem = undefined; // unset
		//delete(elem); // this removes the variable completely | doesnt seem to be working
	}
}

function Set_AutoPlays() {
	autoplays += 1;
	setCookie("YouTube_AutoPlayer", autoplays, 999);
}

function New_Player(startup = false) {
	let arr = Array.from(document.querySelectorAll('video'));
	if (startup && arr[0].paused){
		console.log("Page reload detected. AutoPlaying Video");
	}
	console.log("video is paused = " + arr[0].paused);
	if (arr[0].paused) {
		Set_AutoPlays();
		let control = false;
		arr = Array.from(document.querySelectorAll('button'));
		arr.forEach((arrvalue, index) =>  {
			if (arrvalue.title == "Play (k)") {
				if (control == false) {
					arr[index].click();
					console.log("video played");
					control = true; //locks the control so it cant double press resulting in a paused video. is precationary
				}
			}
		});
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