maxHeight = 600;
maxWidth = 600;

var App = function() {
	if ( !(this instanceof arguments.callee) ) {
		return new arguments.callee(arguments);
	}

	var self = this;

	self.init = function() {
		// Init canvas contexts
		self.canvas = fx.canvas();
		$('#canvasArea').empty();
		$('#canvasArea').append(self.canvas);
		self.isSaved = false;
		self.setupMenus();

		self.openFile();
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
		var dataUrl = self.canvas.toDataURL("image/png");
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
							self.tex = self.canvas.texture(image);
							self.canvas.draw(self.tex).update();
						};
						image.src = dataURL;
					}
				}
			})(files[0]);
			fr.readAsDataURL(files[0]);
		}
	}

	self.sepia = function () {
		$('#richUI').empty();
		$('#richUI').append('<h3>Sepia</h3>');

		// Function to be executed on every change
		var func = function() {
			// Scale change to range 0 - 1.0
			var value = self.sepiaSlider.val()/100;
			self.canvas.draw(self.tex).sepia(value).update();	
		};

		self.sepiaSlider = self.createSlider(0,100, func);
		// set value to 0 for no effect
		self.sepiaSlider.attr('value',0);
			
		$('#richUI').append(self.sepiaSlider);
	}

	self.brightness = function () {
		$('#richUI').empty();
		$('#richUI').append('<h3>Brightness / Contrast</h3>');

		var func = function() {
			// Scale change to range -1.0 - 1.0
			var bsValue = self.brightnessSlider.val()/100;
			var cValue = self.contrastSlider.val()/100;
			self.canvas.draw(self.tex).brightnessContrast(bsValue,cValue).update();	
			
		}

		self.brightnessSlider = self.createSlider(-100, 100, func);
		self.contrastSlider = self.createSlider(-100, 100, func);

		$('#richUI').append(self.brightnessSlider).append(self.contrastSlider);
	}

	self.hueSaturation = function () {
		$('#richUI').empty();
		$('#richUI').append('<h3>Hue / Saturation</h3>');

		var func = function() {
			// Scale change to range -1.0 - 1.0
			var hueValue = self.hueSlider.val()/100;
			var sValue = self.saturationSlider.val()/100;
			self.canvas.draw(self.tex).hueSaturation(hueValue, sValue).update();	
			
		}
		self.hueSlider = self.createSlider(-100, 100, func);
		self.saturationSlider = self.createSlider(-100, 100, func);

		$('#richUI').append(self.hueSlider).append(self.saturationSlider);

	}

	self.createSlider = function(min, max, func) {
		var slider = $('<input/>').attr('type','range').attr('min',min).attr('max',max);
		slider.bind('change', func);
		return slider
	}

	self.setupMenus = function() {
			$('#newMenu').click(self.newFile);			
			$('#openMenu').click(self.openFile);
			$('#saveMenu').click(self.saveFile);
			$('#quitMenu').click(self.quitApp);
			
			$('#sepiaMenu').click(self.sepia);
			$('#hsMenu').click(self.hueSaturation);
			$('#brightnessMenu').click(self.brightness);
	}


	self.init();
}
window.app = new App();
