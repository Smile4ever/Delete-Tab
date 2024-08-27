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

async function saveOptions() { 
	const values = {};
	for(let p in PREFS) {
		values[p] = document.getElementById(p)[PREFS[p].type];
	}

	await browser.storage.sync.set(values);
	browser.runtime.sendMessage({action: "notify", data: browser.i18n.getMessage("notify_preferences_saved")});
}

async function restoreOptions() {
	let result = await browser.storage.sync.get(Object.keys(PREFS));

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
}

async function init(){
	await restoreOptions();

	document.querySelector("form").style.display = "block";
	document.querySelector(".refreshOptions").style.display = "none";
}

window.addEventListener("DOMContentLoaded", init, { passive: true });
document.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); saveOptions(); }, { passive: false });
