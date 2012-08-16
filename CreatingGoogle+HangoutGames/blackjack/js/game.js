
var BlackJackGame = function() {
  this.init();
};

/*
 * Game States:
 * START - beginning of round
 * BET   - players place their beginning bets (will skip in beta)
 * DEAL  - deal cards to players
 * PLAY  - players hit/stay/etc
 * EVAL  - evaluate hands
 * END   - end of game 
 */ 

BlackJackGame.prototype.createCanvas = function() {
  this.gameWidth = window.innerWidth;
  this.gameHeight = window.innerHeight;
  this.canvas = document.getElementById("gameboard");
  this.canvas.width = this.gameWidth;
  this.canvas.height = this.gameHeight;
  this.ctx = this.canvas.getContext("2d");
  this.drawBackground();
};


BlackJackGame.prototype.init = function() {
		
		this.dealer = new Player();
		this.dealer.isDealer = true;
    this.dealer.id = 'dealer';
    this.players = [];
    this.createCanvas();
    var self = this;
		$().ready(function() {self.createCanvas();});
};

BlackJackGame.prototype.getContext = function () {
  return this.ctx;
} ;

BlackJackGame.prototype.drawBackground = function() {
  this.ctx.save();
  this.ctx.fillStyle = 'green';
  this.ctx.strokeStyle = 'black'
  this.ctx.lineCap = 'round';
  this.ctx.fillRect(0,0, this.gameWidth, this.gameHeight);
  this.ctx.restore();
};

BlackJackGame.prototype.checkTurn = function() {
  // Get id of the player's who turn it is
  var playerTurn = gapi.hangout.data.getValue('playerTurn');

  // Get id of current user
  var id = gapi.hangout.getParticipantId();
  var participant = _.find(gapi.hangout.getParticipants(), function(p) {return p.id == id;})
  if (participant.person.id == playerTurn) {
    return true;
  } else return false;
}

BlackJackGame.prototype.setupKeys = function () {
  Mousetrap.bind('h', function() {
    var player;
    if (game.checkTurn()) {
      var playerTurn = gapi.hangout.data.getValue('playerTurn');  
      player = _.find(game.players, function(p) { return p.id == playerTurn});
      player.hit(window.deck.dealCard());
      player.hands[player.currentHand].drawHand();
    }
  });

  Mousetrap.bind('s', function() {
    var player;
    if (game.checkTurn()) {
      var playerTurn = gapi.hangout.data.getValue('playerTurn');  
      player = _.find(game.players, function(p) { return p.id == playerTurn});
      player.stand();
      player.hands[player.currentHand].drawHand();
    }
  });

  Mousetrap.bind('c', function(){
    game.dealer.hands[0] = new Hand();
    game.drawBackground();
  });
};
	
BlackJackGame.prototype.updateGameBoard = function() {
  this.drawBackground();
  // Draw all the players
  
  window.player.drawPlayerImage();
  window.player.hands[0].drawHand();
};

BlackJackGame.prototype.createTurnIndicator = function () {
	var url = "http://latest.ribbitwave.appspot.com/images/button.png";
  var temp = gapi.hangout.av.effects.createImageResource(url);
	this.overlay = temp.createOverlay({
    position:{x:-0.35, y:0.25},
    scale:{
      magnitude:0.25, reference:gapi.hangout.av.effects.ScaleReference.WIDTH
    }});
};

BlackJackGame.prototype.loadPlayerData = function() {
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

BlackJackGame.prototype.dealInitialHand = function() {
  var cardsNeeded = 2 * (game.players.length + 1);
  var cards = deck.dealCards(cardsNeeded);

  _.times(2, function() {
    _.each(game.players, function(p) {
      p.hands[0].addToHand(cards.pop());
      p.savePlayerState(); 
    });
    game.dealer.hands[0].addToHand(cards.pop());
    game.dealer.savePlayerState();
  });
  
  // Transition to PLAY state
  gapi.hangout.data.submitDelta({'gameState':'PLAY', 'playerTurn':game.players[0].id});
}

BlackJackGame.prototype.stateUpdated = function(evt) {
  console.log(evt);
}

BlackJackGame.prototype.changeState = function(state) {
  gapi.hangout.data.setValue('gameState', state);
}


gapi.hangout.onApiReady.add(function(event) {
  if(event.isApiReady) {
    window.game = new BlackJackGame();
    console.log('gapi loaded');
		window.player = new Player();
	  window.game.players = window.game.loadPlayerData();
		// check for saved deck
		if (gapi.hangout.data.getValue('deck') == undefined) {
			groupDeck = new Deck(2);
      gapi.hangout.data.setValue('numDecks', '2');
			gapi.hangout.data.setValue('deck', groupDeck.toString());
		} 
		// local deck for lookup
		window.deck = new Deck(1, window.game.ctx);
		window.game.setupKeys();

    gapi.hangout.data.onStateChanged.add(window.game.stateUpdated);
	}
});

window.BlackJackGame = BlackJackGame;


