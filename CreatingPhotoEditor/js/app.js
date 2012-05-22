maxHeight = 600;
maxWidth = 600;

var App = function() {
	if ( !(this instanceof arguments.callee) ) {
		return new arguments.callee(arguments);
	}

	var self = this;

	self.init = function() {
		// Init canvas contexts
		self.canvas = $('canvas')
		self.ctx1 = self.canvas.get(0).getContext('2d');
		self.ctx2 = null;
		self.isSaved = false;
		self.setupMenus();
	}

	self.newFile = function() {
		self.init();
	}

	self.openFile = function() {
		// Update well with open file stuff
		$('#richUI').empty();
		$('#richUI').append('<h2>Open File</h2>');
		$('#richUI').append("<input id='openFile' type='file' />");
		$('#openFile').get(0).addEventListener('change', self.handleFile, false);
		
	}

	self.saveFile = function() {
		// Save context to data url.
		var dataUrl = self.canvas.get(0).toDataURL("image/png");
		chrome.tabs.create({url: dataUrl});
		
	}

	self.quitApp = function() {
		chrome.tabs.getCurrent(function(tab) {
			chrome.tabs.remove(tab.id);
		});		
	}

	self.handleFile = function(evt) {
		var files = evt.target.files;
		if (files.length > 0) {
			var dataURL; 
			var fr = new FileReader()
			fr.onload = (function(file) {
				return function(e) {
					if (e.target.readyState == 2) {
						var dataURL = e.target.result;
						var image = new Image();
						image.onload = function() {
							self.ctx1.drawImage(this, 0, 0, maxWidth, maxHeight);
						};
						image.src = dataURL;
					}
				}
			})(files[0]);
			fr.readAsDataURL(files[0]);
		}
	}

	self.setupMenus = function() {
			$('#newMenu').click(self.newFile);			
			$('#openMenu').click(self.openFile);
			$('#saveMenu').click(self.saveFile);
			$('#quitMenu').click(self.quitApp);
	}

	self.init();
}
