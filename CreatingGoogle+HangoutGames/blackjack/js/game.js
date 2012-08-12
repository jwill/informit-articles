
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
window['root'] = "//ribbitwave.appspot.com/";
backImage.src = window['root'] + "images/45dpi/back.png";

var BlackJackGame = function() {
	if ( !(this instanceof arguments.callee) ) {
		return new arguments.callee(arguments);
	}

	var self = this;
	
	self.init = function() {
		document.addEventListener("DOMContentLoaded", function() {
			self.gameWidth = window.innerWidth;
			self.gameHeight = window.innerHeight;
			self.canvas = document.getElementById("gameboard");
			$(self.canvas).attr("width", self.gameWidth);
			$(self.canvas).attr("height", self.gameHeight);
			self.ctx = game.canvas.getContext("2d");
			self.drawBackground();
		});
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

	gapi.hangout.onApiReady.add(function(event) {                                                                                                                
		if(event.isApiReady) {                                                                                                                                     
			console.log('gapi loaded');
			window.player = new Player();
			
			// check for saved deck
			if (gapi.hangout.data.getValue('deck') == undefined) {
				groupDeck = new Deck(2, window.game.ctx);
				gapi.hangout.data.setValue('deck', groupDeck.toString());
			} 
			// local deck for lookup
			window.deck = new Deck(1, window.game.ctx);
			window.kibo = new Kibo(game.canvas);
			self.setupKeys();
		}
	});
	
	self.setupKeys = function () {
		var k = window.kibo;
		k.down('h', function(){
			console.log('pressed '+ window.kibo.lastKey());
			window.player.hands[0].addToHand(window.deck.dealCard());
			window.player.hands[0].drawHand();
			// send message to other players
		})
		k.down('c', function(){
			window.player.hands[0] = new Hand();
			window.game.drawBackground();
		})
	};

	self.init();
}
window.game = new BlackJackGame();

