document.addEventListener("DOMContentLoaded", function() {
// Get tab url
chrome.tabs.getSelected(null, function(tab) {
		document.querySelector('#sitename').innerHTML = tab.url;	
		window.siteurl = tab.url;

		// Load current note if any, notes are stored on background page
		var text = chrome.extension.getBackgroundPage().localStorage[window.siteurl];
		if (text != undefined) 
			document.querySelector('[name=note]').value = text;
		});

		// Save button
		document.querySelector("#save").addEventListener("click", function() {
			var text = document.querySelector('[name=note]').value;
			localStorage[window.siteurl] = text;
			// Fire off notification
			chrome.extension.getBackgroundPage().notify("Note saved.");
			window.close();
		});

		// Delete button
		document.querySelector("#delete").addEventListener("click", function() {
			var text = document.querySelector('[name=note]').value;
			chrome.extension.getBackgroundPage().localStorage.removeItem(window.siteurl);
			// Fire off notification
			chrome.extension.getBackgroundPage().notify("Note deleted.");
			window.close();
		});
});
