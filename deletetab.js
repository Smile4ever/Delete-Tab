let delete_tab_blacklist;
let delete_tab_hide_notification;

function init(){
	let valueOrDefault = function(value, defaultValue){
		if(value == undefined)
			return defaultValue;
		return value;
	}

	let valueOrDefaultArray = function(value, defaultValue){
		let calcValue = valueOrDefault(value, defaultValue);
		return calcValue.split(" ").join("").split(",");
	}

	browser.storage.sync.get([
		"delete_tab_blacklist",
		"delete_tab_hide_notification"
	]).then((result) => {
		delete_tab_blacklist = valueOrDefaultArray(result.delete_tab_blacklist, "");
		delete_tab_hide_notification = valueOrDefault(result.delete_tab_hide_notification, false);

		let preventRegistering = false;
		if(delete_tab_blacklist[0] != ""){
			for(let site of delete_tab_blacklist){
				if(site == getRootDomain(window.location.href) || window.location.href.indexOf(site) > -1){
					preventRegistering = true;
				}
			}
		}

		if(!preventRegistering){
			//console.log("Registering for " + window.location.href);
			registerDeleteTab();
		}else{
			//console.log("Not registering Delete Tab for " + window.location.href);
		}
	}).catch(console.error);
}
init();

function sendMessage(action, data){
	browser.runtime.sendMessage({"action": action, "data": data});
}

function registerDeleteTab(){
	window.addEventListener("keyup", function (event) {
		if (event.defaultPrevented) {
			return;
		}

		if (event.key == "Delete"){	
			// Check if modifier is pressed (ctrl, shift). If so, return.
			if(event.getModifierState("Alt") || event.getModifierState("Shift") || event.getModifierState("Control") || event.getModifierState("Meta") || event.getModifierState("OS") || event.getModifierState("AltGraph")){
				setTestSuiteResult("Modifier pressed");
				return;
			}
			
			// Check if there is a checkbox selection (Zoho Mail / more to come)
			if(document.querySelectorAll(".SC_check").length > 0 || document.querySelectorAll("input:checked").length > 0){
				setTestSuiteResult("Selected items > 0");
				return;
			}
			
			let tagName = document.activeElement.tagName.toLowerCase();
			if(tagName == "input" || tagName == "textarea" || tagName == "button" || tagName == "i"){
				setTestSuiteResult("Input fix");
				return;
			}
			
			if(document.activeElement.hasAttribute("contenteditable")){
				setTestSuiteResult("Contenteditable fix");
				return;
			}

			if(document.hasFocus() && (tagName == "body" || tagName == "a")){
				event.preventDefault();

				if(!setTestSuiteResult("Closing")){
					sendMessage("closeTabOnDelete", delete_tab_hide_notification);
				}
			}else{
				setTestSuiteResult("No focus");
				return;
			}
		}
	}, true);
}

function setTestSuiteResult(testSuiteResult){
	let testSuiteResultElement = document.getElementById("testSuiteResult");
	console.log("testSuiteResult is " + testSuiteResult);
	if(testSuiteResultElement != null){
		testSuiteResultElement.textContent = testSuiteResult;
		return true;
	}else{
		return false;
	}
}

/// Neat URL code
// Copied from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
function getDomain(url) {
	if(url == undefined || url == null) return null;

    var hostname = url.replace("www.", ""); // leave www out of this discussion. I don't consider this a subdomain
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = hostname.split('/')[2];
    }
    else {
        hostname = hostname.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

/// Neat URL code
// Copied from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
function getRootDomain(url) {
	if(url == undefined || url == null) return null;

    var domain = getDomain(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        if(splitArr[arrLen - 2].length <= 3){
            // oops.. this is becoming an invalid URL
            // Example URLs that trigger this code path are https://images.google.co.uk and https://google.co.uk
            domain = splitArr[arrLen - 3] + '.' + splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        }else{
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        }
    }

    return domain;
}
