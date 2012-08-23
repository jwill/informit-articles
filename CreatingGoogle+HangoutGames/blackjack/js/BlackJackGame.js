
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
 * DPLAY - play dealer hand
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
    this.dealer.hands[0].setPosition(140,0);
    this.evaluator = new Evaluator();
    this.evaluator.setDealer(this.dealer.getCurrentHand());
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

BlackJackGame.prototype.drawStaticAssets = function() {
  // draw game text and player images
  this.ctx.save();
  this.ctx.font = '20px Arial';
  this.ctx.fillStyle = 'black';
  this.ctx.fillText('Dealer', 0, 20);
  this.ctx.restore();
};

BlackJackGame.prototype.checkTurn = function() {
  // Get id of the player's who turn it is
  var playerTurn = gapi.hangout.data.getValue('playerTurn');

  // Get id of current user
  var id = gapi.hangout.getParticipantId();
  var participant = _.find(gapi.hangout.getEnabledParticipants(), function(p) {return p.id == id;})
  if (participant.person.id == playerTurn) {
    return true;
  } else return false;
}

BlackJackGame.prototype.nextPlayer = function() {
  var playerTurn = gapi.hangout.data.getValue('playerTurn');
  var enabledParticipants = gapi.hangout.getEnabledParticipants();
  for (var i = 0; i<enabledParticipants.length; i++) {
    var participant = enabledParticipants[i];
    // TODO Check if they are active in the current game
    if (participant.person.id == playerTurn) {
      if (enabledParticipants[i+1] != undefined) {
        var nextPlayer = enabledParticipants[i+1];
        gapi.hangout.data.setValue('playerTurn', nextPlayer.person.id);
        return nextPlayer;
      }
    }
  }
  // If there aren't any more players that need to play, go to the
  // dealer
  gapi.hangout.data.setValue('gameState', 'DPLAY');
};

BlackJackGame.prototype.playDealerHand = function() {
  var hand = game.dealer.getCurrentHand();
  var handStatus = game.evaluator.evaluate(hand);
  // If 17 or higher, stand, otherwise hit
  var lt17 = _.any(handStatus.handTotals, function(total) {return total<17;})
  if(lt17){
    game.dealer.hit(deck.dealCard());
    game.dealer.getCurrentHand().drawHand();
    handStatus = game.evaluator.evaluate(game.dealer.getCurrentHand());
    lt17 = _.any(handStatus.handTotals, function(total) {return total<17;})
    // Tweaking the string value is needed to make it fire a new event
    gapi.hangout.data.setValue('gameState', 'DPLAY'+new Date().getTime() );   
  } else {
    gapi.hangout.data.setValue('gameState', 'EVAL');
  }
};

BlackJackGame.prototype.evaluateHands = function(dealerHand) {
  // TODO Handle dealer blackjack
  this.players = this.loadPlayerData();
  _.each(this.players, function(player) {
    _.each(player.hands, function(hand) {
      var playerHand = game.evaluator.evaluate(hand);
      if (playerHand.isBust) {
        // Lose
        console.log('Player bust');
      } else if (dealerHand.isBust) {
        // Win
        console.log('Dealer bust');        
      } else if (playerHand.maxTotal > dealerHand.maxTotal) {
        // Win
        console.log('Player win');        
      } else if (playerHand.maxTotal < dealerHand.maxTotal) {
        // Lose
        console.log('Player lost');        
      } else {
        // Push
        console.log('Push');        
      }
      
    });    
  });
  // TODO Transition state
};


BlackJackGame.prototype.setupKeys = function () {
  Mousetrap.bind('h', function() {
    var player;
    if (game.checkTurn()) {
      var playerTurn = gapi.hangout.data.getValue('playerTurn');  
      player = _.find(game.players, function(p) { return p.id == playerTurn});
      if (!game.evaluator.isBust(player.getCurrentHand())) {
        player.hit(window.deck.dealCard());
        player.hands[player.currentHand].drawHand();
      }
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
  
  //window.player.drawPlayerImage();
  //window.player.hands[0].drawHand();
  // TODO position player hands
  _.each(this.players, function(player) {
    _.each(player.hands, function(hand) {
      hand.drawHand();
    });
  });

  this.dealer.getCurrentHand().drawHand();
};

BlackJackGame.prototype.newRound = function() {
  this.players = this.loadPlayerData();
  _.each(this.players, function(player) {
    player.clearCards();
    player.savePlayerState(); 
  });

  this.dealer.clearCards();
  this.dealer.savePlayerState();
  // set dealer hand and position
  // TODO DRY later
  this.dealer.hands[0].setPosition(140,0);
  this.evaluator.setDealer(this.dealer.getCurrentHand());

  // Set first player 
  gapi.hangout.data.setValue('gameState', 'DEAL');
}

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
      var player = new Player();
      player.id = participant.person.id;
      player.loadPlayerImage(participant.person.image.url);
      
      var state = gapi.hangout.data.getValue(player.id);
      if (state) {
        player.hands = this.loadState(player.id);        
      }
      console.log(player.hands);
    players.push(player);
  }
  return players;
}

BlackJackGame.prototype.loadState = function(id) {
  var playerData = JSON.parse(gapi.hangout.data.getValue(id));
  var handsData = JSON.parse(playerData.hands);
  var hands = [];
  // Parse cards/hands
  _.each(handsData, function(hand) {
    var h = new Hand();
    _.each(hand, function(cardValue){
      var card = deck.lookupCard(JSON.parse(cardValue));
      h.addToHand(card);
    });
    hands.push(h);
  });
  return hands;
};

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
    game.updateGameBoard();
  });
  
  // Transition to PLAY state
  gapi.hangout.data.submitDelta({'gameState':'PLAY', 'playerTurn':game.players[0].id});
}

BlackJackGame.prototype.stateUpdated = function(evt) {
  // TODO Only run on host
  var gameState = _.find(evt.addedKeys, function(item) {
    return item.key == 'gameState';
  });
  if (gameState != undefined) {
    if (gameState.value.substr(0,5) == "DPLAY") {
      console.log('DPLAY');
      //try {
        game.playDealerHand();
      //  console.log('after deal hand');
      //} catch (ex) {
      //  console.log(ex);
      //}
    } else if (gameState.value == 'EVAL') {
       // Evaluate game hands and do payouts
      var hand = game.loadState('dealer')[0];
      var handStatus = game.evaluator.evaluate(hand);
      game.evaluateHands(handStatus); 
    }
  }
}

BlackJackGame.prototype.changeState = function(state) {
  gapi.hangout.data.setValue('gameState', state);
}

BlackJackGame.prototype.resetDeck = function(numDecks) {
  if (numDecks == undefined)
    numDecks = 2;
  groupDeck = new Deck(numDecks);
  gapi.hangout.data.setValue('numDecks', ''+numDecks);
	gapi.hangout.data.setValue('deck', groupDeck.toString());
}

gapi.hangout.onApiReady.add(function(event) {
  if(event.isApiReady) {
    window.game = new BlackJackGame();
    console.log('gapi loaded');
		window.player = new Player();
	  window.game.players = window.game.loadPlayerData();
		// check for saved deck
		if (gapi.hangout.data.getValue('deck') == undefined) {
      game.resetDeck(2);
    } 
		// local deck for lookup
		window.deck = new Deck(1, window.game.ctx);
		window.game.setupKeys();

    gapi.hangout.data.onStateChanged.add(window.game.stateUpdated);
	}
});

window.BlackJackGame = BlackJackGame;


