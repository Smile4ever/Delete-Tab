///Messages
// listen for messages from the content or options script
browser.runtime.onMessage.addListener(function(message) {
	switch (message.action) {
		case "notify":
			notify(message.data);
			break;
		case "closeTabOnDelete":
			closeTabOnDelete(message.data);
			break;
		default:
			break;
	}
});

function closeTabOnDelete(show_notification){
	function logTabs(tabs) {
		for (tab of tabs) {
			if(show_notification){
				notify("Closed tab " + tab.title);
			}
			browser.tabs.remove(tab.id);
		}
	}

	browser.tabs.query({currentWindow: true, active: true}).then(logTabs, onError);
}

/// Helper functions
function onError(error) {
	console.error(`Error: ${error}`);
}

function notify(message){
	browser.notifications.create({
		type: "basic",
		iconUrl: browser.extension.getURL("icons/delete-tab-128.png"),
		title: "Delete Tab",
		message: message
	});
}
