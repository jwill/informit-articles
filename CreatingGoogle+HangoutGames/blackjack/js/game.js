function ComputerEvent(action, playerCards) {
    var self = this;
    self.action = action;
    self.playerCards =playerCards;
}

backImage = new Image()
backImage.onload = function() {
        console.log("loaded");
      //  window.game = new WarGame();
}
backImage.src = "images/90dpi/back.png"

var BlackJackGame = function() {
	if ( !(this instanceof arguments.callee) ) {
		return new arguments.callee(arguments);
	}

	var self = this;
	self.gameWidth = 800;
	self.gameHeight = 600;
	self.init = function() {
		self.canvas = document.getElementById("gameboard");
		$(self.canvas).attr("width", self.gameWidth);
		$(self.canvas).attr("height", self.gameHeight);
		self.ctx = self.canvas.getContext("2d");
		self.drawBackground();
		
	}

	self.getContext = function () {
		return self.ctx;
	} 

	self.drawBackground = function() {
		self.ctx.save();
		self.ctx.fillStyle = 'green';
		self.ctx.strokeStyle = 'black'
		self.ctx.lineCap = 'round';
		self.ctx.fillRect(0,0, self.gameWidth, self.gameHeight);
		self.ctx.restore();
	}

	

	self.init();
}

