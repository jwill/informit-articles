var App = function() {
	if ( !(this instanceof arguments.callee) ) {
		return new arguments.callee(arguments);
	}

	var self = this;

	self.init = function() {
		// Init canvas contexts
		self.ctx1 = null;
		self.ctx2 = null;
	}

	self.newFile = function() {

	}

	self.saveFile = function() {

	}

	self.quitApp = function() {
		chrome.tabs.getCurrent(function(tab) {
			console.log(tab);
		});		
	}
}

// Function courtesy of http://www.html5rocls.com/en/tutorials/file/dndfiles
function handleFileSelect(evt) {
	var files = evt.target.files;

	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		
	}
}

//document.getElementById('files').addEventListener('change', handleFileSelect, false);
