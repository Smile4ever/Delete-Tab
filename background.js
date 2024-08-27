///Messages
// listen for messages from the content or options script
browser.runtime.onMessage.addListener(async function(message) {
	switch (message.action) {
		case "notify":
			notify(message.data);
			break;
		case "closeTabOnDelete":
			await closeTabOnDelete(message.data);
			break;
		default:
			break;
	}
});

async function closeTabOnDelete(show_notification){
	let tabs = await browser.tabs.query({currentWindow: true, active: true});
	let tab = tabs[0];

	if(show_notification){
		notify("Closed tab " + tab.title);
	}
	browser.tabs.remove(tab.id);
}

/// Helper functions
function onError(error) {
	console.error(`Error: ${error}`);
}

function notify(message){
	browser.notifications.create({
		type: "basic",
		iconUrl: browser.runtime.getURL("icons/delete-tab-128.png"),
		title: "Delete Tab",
		message: message
	});
}
