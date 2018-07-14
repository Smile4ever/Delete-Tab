const PREFS = {
	"delete_tab_blacklist": {
		"type": "value",
		"default": ""
	},
	"delete_tab_hide_notification": {
		"type": "checked",
		"default": true
	}
};

function saveOptions() { 
	const values = {};
	for(let p in PREFS) {
		values[p] = document.getElementById(p)[PREFS[p].type];
	}

	browser.storage.sync.set(values).then(() => browser.runtime.sendMessage({action: "notify", data: browser.i18n.getMessage("notify_preferences_saved")}));
}

function restoreOptions() {
	return browser.storage.sync.get(Object.keys(PREFS)).then((result) => {
		let val;
		for(let p in PREFS) {
			if(p in result) {
				val = result[p];
			}
			else {
				val = PREFS[p].default;
			}
			document.getElementById(p)[PREFS[p].type] = val;
		}
	}).catch(console.error);
}

function init(){
	restoreOptions();

	document.querySelector("form").style.display = "block";
	document.querySelector(".refreshOptions").style.display = "none";
}

window.addEventListener("DOMContentLoaded", init, { passive: true });
document.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); saveOptions(); }, { passive: false });
