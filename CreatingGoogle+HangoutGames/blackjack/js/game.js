
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
		
		window.createCanvas = function() {
			self.gameWidth = window.innerWidth;
			self.gameHeight = window.innerHeight;
			self.canvas = document.getElementById("gameboard");
			$(self.canvas).attr("width", self.gameWidth);
			$(self.canvas).attr("height", self.gameHeight);
			self.ctx = game.canvas.getContext("2d");
			self.drawBackground();
		}
		$().ready(function() {window.createCanvas();});
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
	
	self.updateGameBoard = function() {
		self.game.drawBackground();
		// Draw all the players
		
		window.player.drawPlayerImage();
		window.player.hands[0].drawHand();
	}
	
	self.loadPlayerData = function() {
		var hangoutParticipantId = gapi.hangout.getParticipantId();
		var enabledPlayers = gapi.hangout.getEnabledParticipants();
		var players = [];
		for (var i = 0; i<enabledPlayers.length; i++) {
			var participant = enabledPlayers[i];
			//if (participant.id != hangoutParticipantId) {
				var player = new Player();
				player.id = participant.person.id;
				player.loadPlayerImage(participant.person.image.url);
				
				var state = gapi.hangout.data.getValue(player.id);
				if (state) {
					var playerData = JSON.parse(gapi.hangout.data.getValue(player.id));
					var handsData = JSON.parse(playerData.hands);
					player.hands = [];
					// Parse cards/hands
					_.each(handsData, function(hand) {
						var h = new Hand();
						_.each(hand, function(cardValue){
							var card = deck.lookupCard(JSON.parse(cardValue));
							h.addToHand(card);
						});
						player.hands.push(h);
					});
					for (var j = 0; j < handsData.length; j++) {
						var cardsArray = handsData[j];
					}
					
				}
				console.log(player.hands);
			//}
			players.push(player);
		}
		return players;
	}

	self.init();
}
window.game = new BlackJackGame();

