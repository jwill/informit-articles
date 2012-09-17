var Player = function() {
  this.isComputer = false;
	this.isDealer = false;
	this.playerImage = false;
	
	this.currentHand = 0;
  this.currentBet = 1;
	this.id = null;
	this.isPlayerTurn = false;
	this.isLocal = false;

  this.hands = [new Hand()];
  this.tokens = 1000;
  this.evaluator = new Evaluator();
};

Player.prototype.adjustFunds = function(amount) {
  this.tokens += amount;
}

Player.prototype.setPlayerId = function(id) {
	this.playerId = id;
}

Player.prototype.hit = function(card) {
  console.log("hit");
	// Hit current hand
  var hand = this.hands[this.currentHand];
	hand.addToHand(card);
  // Check for bust
  if (this.evaluator.isBust(hand)) {
    this.stand();
  } else {
    // Save hand to state
    this.savePlayerState();	
  }
}

Player.prototype.getCurrentHand = function() {
  return this.hands[this.currentHand];
};

Player.prototype.clearCards = function() {
  this.hands = [new Hand()];
  this.currentHand = 0;
}
	
Player.prototype.stand = function() {
  var updates = {};
  updates[this.id] = this.toString();

  console.log("stand");
	if (this.hands.length-1 != this.currentHand) {
		this.currentHand++;
	} else {
    if (this.id != 'dealer') {
      // player done
      var nextPlayer = game.nextPlayer();
      updates['playerTurn'] = nextPlayer;
      if (nextPlayer == 'dealer') updates['gameState'] = 'DPLAY';
    }
  }
  gapi.hangout.data.submitDelta(updates);
}
	
Player.prototype.drawPlayerImage = function(x,y, sx, sy) {
	if (this.playerImage)
    if (sx == undefined) {
		  game.ctx.drawImage(this.playerImage, x, y, sx, sy);
    } else game.ctx.drawImage(this.playerImage, x, y);
}

Player.prototype.toString = function() {
	var p = {};
	p.id = this.id;
	p.currentBet = this.currentBet;
  p.tokens = this.tokens;
	p.isPlayerTurn = this.isPlayerTurn;
	p.playerImageURL = this.playerImageURL;
	
  var handsValue = [];
	for (var i = 0; i<this.hands.length; i++) {
		var hand = this.hands[i];
		var handState = hand.getState();
		handsValue.push(handState);
	}
	
  p.hands = JSON.stringify(handsValue);
	
	return JSON.stringify(p);
}

Player.prototype.savePlayerState = function() {
	var p = {};
	p.id = this.id;
	p.currentBet = this.currentBet;
  p.tokens = this.tokens;
	p.isPlayerTurn = this.isPlayerTurn;
	p.playerImageURL = this.playerImageURL;
	
  var handsValue = [];
	for (var i = 0; i<this.hands.length; i++) {
		var hand = this.hands[i];
		var handState = hand.getState();
		handsValue.push(handState);
	}
	
  p.hands = JSON.stringify(handsValue);
	console.log(p);
	gapi.hangout.data.setValue(p.id, JSON.stringify(p));
}

Player.prototype.loadPlayerImage = function (imgSrc) {		
		var image = new Image();
		var self = this;
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
