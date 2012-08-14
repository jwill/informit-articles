function Player() {
  if ( !(this instanceof arguments.callee) ) {
  	 return new arguments.callee(arguments); 
  }
	
	var self = this; 

	self.isComputer = false;
	self.isDealer = false;
	self.playerImage = false;
	
	self.currentHand = 0;
	self.id = null;
	self.isPlayerTurn = false;
	self.isLocal = false;
	
	self.init = function () {
		// For now there is only one
		// but there could be multiples 
		// splitting is implemented 
		self.hands = [new Hand()];
		self.tokens = 1000;
	}
	
	self.setPlayerId = function(id) {
		self.playerId = id;
	}
	
	self.loadPlayerImage = function (imgSrc) {
		
		
		var image = new Image();
		image.onload = function() {
			var canvas = document.createElement("canvas");
			var width = image.width;
			var height = image.height;
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(this, 0, 0);
			
			self.playerImage = canvas;
			self.playerImageURL = imgSrc;
		}
		image.src = imgSrc;
	} 
	
	self.hit = function(card) {
		// Hit current hand
		self.hands[self.currentHand].addToHand(card);
		// Save hand to state
		
	}
	
	self.stand = function() {
		if (self.hands.length > 1) {
			self.currentHand++;
		}
	}
	
	self.drawPlayerImage = function(x,y) {
		if (self.playerImage)
			game.ctx.drawImage(self.playerImage, x, y);
	}
	
	self.savePlayerState = function() {
		var p = {};
		p.id = self.id;
		p.currentBet = 1;
		p.isPlayerTurn = self.isPlayerTurn;
		p.playerImageURL = self.playerImageURL;
		var handsValue = [];
		for (var i = 0; i<self.hands.length; i++) {
			var hand = self.hands[i];
			var handState = hand.getState();
			handsValue.push(handState);
		}
		p.hands = JSON.stringify(handsValue);
		console.log(p);
		gapi.hangout.data.setValue(p.id, JSON.stringify(p));
	}

	self.init(); 
}
