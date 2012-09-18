
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
  /* Width of sidebar + 5px gap */
  this.gameWidth = window.innerWidth - 305;
  this.gameHeight = window.innerHeight;
  this.canvas = document.getElementById("gameboard");
  this.canvas.width = this.gameWidth;
  this.canvas.height = this.gameHeight;
  this.ctx = this.canvas.getContext("2d");
  this.drawBackground(this.ctx, this.gameWidth, this.gameHeight);
};

BlackJackGame.prototype.drawSideCanvas = function(width, height) {
  this.canvasSideBar = document.getElementById('canvasSideBar');
  this.canvasSideBar.width = width;
  this.canvasSideBar.height = height;
  this.sidebarWidth = width;
  this.sidebarHeight = height;
  this.sidebarCtx = this.canvasSideBar.getContext('2d');
  this.drawBackground(this.sidebarCtx, width, height);
};


BlackJackGame.prototype.init = function() {
    this.playerId = gapi.hangout.getLocalParticipantId();
    this.dealer = new Player();
    this.dealer.isDealer = true;
    this.dealer.id = 'dealer';
    this.dealer.hands[0].setPosition(140,0);
    this.evaluator = new Evaluator();
    this.evaluator.setDealer(this.dealer.getCurrentHand());
    this.players = [];
    this.createCanvas();
    this.drawSideCanvas(300,325);
    this.setupButtons();
    this.updateGameBoard();
    var self = this;
    $().ready(function() {self.createCanvas();});
};

BlackJackGame.prototype.getContext = function () {
  return this.ctx;
};

BlackJackGame.prototype.getSidebarContext = function() {
  return this.sidebarCtx;
};

BlackJackGame.prototype.drawVideoFeed = function() {

};

BlackJackGame.prototype.drawBackground = function(context, width, height) {
  context.save();
  context.fillStyle = 'green';
  context.strokeStyle = 'black'
  context.lineCap = 'round';
  context.fillRect(0,0, width, height);
  context.restore();
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
  return playerTurn === this.playerId;
}

BlackJackGame.prototype.nextPlayer = function() {
  var playerTurn = gapi.hangout.data.getValue('playerTurn');
  var enabledParticipants = gapi.hangout.getEnabledParticipants();
  for (var i = 0; i<enabledParticipants.length; i++) {
    var participant = enabledParticipants[i];
    // TODO Check if they are active in the current game
    if (participant.id == playerTurn) {
      if (enabledParticipants[i+1] != undefined) {
        var nextPlayer = enabledParticipants[i+1];
        return nextPlayer.id;
      }
    }
  }
  // If there aren't any more players that need to play, go to the
  // dealer
  return 'dealer';
};

BlackJackGame.prototype.playDealerHand = function() {
  var updates = {
  };

  var hand = game.dealer.getCurrentHand();
  game.evaluator.setDealer(hand);
  var handStatus = game.evaluator.evaluate(hand);
  // If 17 or higher, stand, otherwise hit
  var lt17 = _.any(handStatus.handTotals, function(total) {return total<17;});
  var is21 = _.any(handStatus.handTotals, function(total) {return total==21;});
  if (is21) {
    updates['gameState'] = 'EVAL';
  } else if(lt17){
    game.dealer.hit(game.deck.dealCard());
    updates['dealer'] = game.dealer.toString();
    game.dealer.getCurrentHand().drawHand(game.getContext());
    // Tweaking the string value is needed to make it fire a new event
    updates['gameState'] = 'DPLAY'+new Date().getTime();
  } else {
    updates['gameState'] = 'EVAL';
  }

  gapi.hangout.data.submitDelta(updates);
};

BlackJackGame.prototype.evaluateHands = function(dealerHand) {
  var updates = {};
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
        player.adjustFunds(2 * player.currentBet);
      } else if (playerHand.maxTotal > dealerHand.maxTotal) {
        // Win
        console.log('Player win');        
        player.adjustFunds(2 * player.currentBet);
      } else if (playerHand.maxTotal < dealerHand.maxTotal) {
        // Lose
        console.log('Player lost');
      } else {
        // Push
        console.log('Push');        
        player.adjustFunds(player.currentBet);
      }
    });
    updates[player.id] = player.toString();
  });
  updates['gameState'] = 'END';
  gapi.hangout.data.submitDelta(updates);
};

BlackJackGame.prototype.setupButtons = function() {
  var self = this;
  var btnDeal = document.querySelector('#btnDeal');
  btnDeal.onclick = function() {
    var currentPlayer = gapi.hangout.getLocalParticipantId();
    // TODO Check for proper game state
    if (game.getGameHost() == currentPlayer) {
      game.newRound();
      // TODO Remove this later
      game.dealInitialHand();
    }
  }


  var btnStand = document.querySelector('#btnStand');
  btnStand.onclick = function() {
    if (game.checkTurn()) {
      var playerTurn = gapi.hangout.data.getValue('playerTurn');  
      player = _.find(game.players, function(p) { return p.id == playerTurn});
      player.stand();
    }
  }

  var btnHit = document.querySelector('#btnHit');
  btnHit.onclick = function() {
    if (game.checkTurn()) {
      var playerTurn = gapi.hangout.data.getValue('playerTurn');  
      player = _.find(game.players, function(p) { return p.id == playerTurn});
      if (!game.evaluator.isBust(player.getCurrentHand())) {
        player.hit(game.deck.dealCard());
        player.hands[player.currentHand].drawHand(game.getSidebarContext());
      }
    }
  }

  var btnDblDown = document.querySelector('#btnDoubleDown');
  btnDblDown.onclick = function() {
    if (game.checkTurn()) {
      var playerTurn = gapi.hangout.data.getValue('playerTurn');  
      player = _.find(game.players, function(p) { return p.id == playerTurn});
      // If the player hasn't hit yet
      if (player.getCurrentHand().cards.length == 2) {
        player.hit(game.deck.dealCard());
        player.hands[player.currentHand].drawHand(game.getSidebarContext());
        player.stand();
      }
    }
  }
}

BlackJackGame.prototype.setupKeys = function () {
  Mousetrap.bind('h', function() {
    var player;
    if (game.checkTurn()) {
      var playerTurn = gapi.hangout.data.getValue('playerTurn');  
      player = _.find(game.players, function(p) { return p.id == playerTurn});
      if (!game.evaluator.isBust(player.getCurrentHand())) {
        player.hit(game.deck.dealCard());
        player.hands[player.currentHand].drawHand(game.getSidebarContext());
      }
    }
  });

  Mousetrap.bind('s', function() {
    var player;
    if (game.checkTurn()) {
      var playerTurn = gapi.hangout.data.getValue('playerTurn');  
      player = _.find(game.players, function(p) { return p.id == playerTurn});
      player.stand();
      player.hands[player.currentHand].drawHand(game.getSidebarContext());
    }
  });

  Mousetrap.bind('c', function(){
    game.dealer.hands[0] = new Hand();
    game.drawBackground(this.ctx, this.gameWidth, this.gameHeight);
  });
};

BlackJackGame.prototype.drawPlayerHeader = function(player) {
  var playerSidebarImage = document.querySelector('img');
  playerSidebarImage.src = player.playerImageURL;
  playerSidebarImage.width = 48;

  var playerName = document.querySelector('#name');
  playerName.textContent = player.name;
  
  var playerScore = document.querySelector('#score');
  playerScore.textContent = '$' + player.tokens;
};
  
BlackJackGame.prototype.updateGameBoard = function() {
  this.drawBackground(this.getContext(), this.gameWidth, this.gameHeight);
  this.drawBackground(this.getSidebarContext(), this.sidebarWidth, this.sidebarHeight);
  // Draw the dealer
  this.dealer.getCurrentHand().drawHand(this.getContext());
  
  // Draw the player panel
  // TODO Allow drawing other players and storing the current viewed player
  var self = this;
  var currentPlayer = _.find(this.players, function(p) {return p.id === self.playerId});
  if (currentPlayer != undefined) {
    this.drawPlayerHeader(currentPlayer);

    _.each(currentPlayer.hands, function(hand) {
      hand.drawHand(self.getSidebarContext());
    });

  }
  // Draw the static assets
  
};

BlackJackGame.prototype.newRound = function() {
  var updates = {};
  updates['gameState'] = 'DEAL';
  this.players = this.loadPlayerData();
  _.each(this.players, function(player) {
    player.clearCards();
    updates[player.id] = player.toString();
  });

  this.dealer.clearCards();
  updates['dealer'] = this.dealer.toString();
  // set dealer hand and position
  // TODO DRY later
  this.dealer.hands[0].setPosition(140,0);
  this.evaluator.setDealer(this.dealer.getCurrentHand());

  game.updateGameBoard(); 
  gapi.hangout.data.submitDelta(updates);
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

BlackJackGame.prototype.findPlayerById = function(id) {
  for (var i = 0; i<game.players.length; i++) {
    var player = game.players[i];
    if (player.id == id) return player;
  }
  return null;
}

BlackJackGame.prototype.loadPlayerData = function() {
  var enabledPlayers = gapi.hangout.getEnabledParticipants();
  var players = [];
  var player;
  for (var i = 0; i<enabledPlayers.length; i++) {
    var participant = enabledPlayers[i];
    //Load or create Player object
    player = this.findPlayerById(participant.id);
    if (player == null) {
      player = new Player();
      player.id = participant.id;
      player.name = participant.person.displayName;
      console.log('loaded image');
      player.loadPlayerImage(participant.person.image.url);
    }
    var state = gapi.hangout.data.getValue(player.id);
    if (state) {
      var playerData = JSON.parse(gapi.hangout.data.getValue(player.id));
      player.tokens = playerData.tokens;
      player.currentBet = playerData.currentBet;
      player.hands = this.loadState(player.id);        
    }
    players.push(player);
  }
  if (gapi.hangout.data.getValue('dealer') != undefined) {
    game.dealer.hands = this.loadState('dealer');
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
      var card = game.deck.lookupCard(JSON.parse(cardValue));
      h.addToHand(card);
    });
    hands.push(h);
  });
  return hands;
};

BlackJackGame.prototype.dealInitialHand = function() {
  var updates = {
    gameState:'PLAY',
    playerTurn: game.players[0].id
  };
  var cardsNeeded = 2 * (game.players.length + 1);
  var cards = game.deck.dealCards(cardsNeeded);

  _.times(2, function() {
    _.each(game.players, function(p) {
      p.hands[0].addToHand(cards.pop());
      updates[p.id] = p.toString();
    });
    game.dealer.hands[0].addToHand(cards.pop());
    updates['dealer'] = game.dealer.toString();
    game.updateGameBoard();
  });

  _.each(game.players, function(p) {
    p.tokens -= p.currentBet;
    updates[p.id] = p.toString();
  });

  var d = game.dealer.getCurrentHand();
  game.evaluator.setDealer(d);

  
  // Transition to PLAY state
  gapi.hangout.data.submitDelta(updates);
}

BlackJackGame.prototype.calculateHandPositions = function() {
  
}

BlackJackGame.prototype.changedKey = function() {
  var metadata = gapi.hangout.data.getStateMetadata();
  var changedKey = '';
  var timestamp = 0;

  for (key in metadata) {
    if (metadata[key].timestamp > timestamp){
      timestamp = metadata[key].timestamp;
      changedKey = key;
    }
  }
  return changedKey;
}

BlackJackGame.prototype.stateUpdated = function(evt) {
  var gameHost = game.getGameHost();
  var currentPlayer = gapi.hangout.getLocalParticipantId();
  if (gameHost == currentPlayer) {
    // Only run on host
    // Manage game state and evaluators
    game.gameState = evt.state.gameState;
    if (game.gameState != undefined) {
      if (game.gameState.substr(0,5) == "DPLAY") {
        console.log('DPLAY');
        //try {
          game.playDealerHand();
        //  console.log('after deal hand');
        //} catch (ex) {
        //  console.log(ex);
        //}
      } else if (game.gameState == 'EVAL') {
         // Evaluate game hands and do payouts
        var hand = game.loadState('dealer')[0];
        var handStatus = game.evaluator.evaluate(hand);
        game.evaluateHands(handStatus); 
      } else {
        game.players = game.loadPlayerData();
        game.updateGameBoard();
      }
    }
  } else {
    game.players = game.loadPlayerData();
    game.updateGameBoard();

  }
}

BlackJackGame.prototype.changeState = function(state) {
  gapi.hangout.data.setValue('gameState', state);
}

BlackJackGame.prototype.participantEnabledApp = function(evt) {
  // Participant enabled app
  // create local deck
  // create empty hand
  // local deck for lookup
  game.deck = new Deck(1, window.game.ctx);
  window.game.setupKeys();

  console.log('participantEnabledApp')
}

BlackJackGame.prototype.participantsChanged = function(evt) {
  console.log('participantsChanged');
}

BlackJackGame.prototype.participantsDisabled = function(evt) {
  var host = game.getGameHost();
  var reselectHost = false;
  for (var i = 0; i<evt.disabledParticipants.length; i++) {
    var participant = evt.disabledParticipants[i];
    if (participant.id == host) {
      reselectHost = true;
    }
    // Remove player's game state
    gapi.hangout.data.clearValue(partcipant.id);
  }
  if (reselectHost == true) {
    game.getGameHost();
  }
}

BlackJackGame.prototype.getGameHost = function() {
  var host = gapi.hangout.data.getValue('host');
  if (host) {
    return host;
  } else return this.selectGameHost();
}

BlackJackGame.prototype.selectGameHost = function(num) {
  // Get list of participants
  // If no params are passed, make the first person the host
  var participants = gapi.hangout.getEnabledParticipants();
  var host;
  if (num) {
     if (participants[num] !== undefined) {
       host = participants[num];
     } else host = participants[participants.length - 1];
  } else {
    host = participants[0].id;
  }
  gapi.hangout.data.setValue('host', host);
  return host;
}

BlackJackGame.prototype.resetDeck = function(numDecks) {
  if (numDecks == undefined)
    numDecks = 2;
  groupDeck = new Deck(numDecks);
  var updates = {
    numDecks:''+numDecks,
    deck:groupDeck.toString()
  }
  gapi.hangout.data.submitDelta(updates);
}


gapi.hangout.onApiReady.add(function(event) {
  console.log('gapi loaded');  
  if(event.isApiReady) {
    window.game = new BlackJackGame();
    window.player = new Player();
    window.game.players = window.game.loadPlayerData();
    window.game.deck = new Deck(1, window.game.ctx);

    // check for saved deck
    if (gapi.hangout.data.getValue('deck') == undefined) {
      game.resetDeck(2);
    } 
    
    gapi.hangout.data.onStateChanged.add(window.game.stateUpdated);
    gapi.hangout.onAppVisible.add(window.game.participantEnabledApp);
    gapi.hangout.onParticipantsEnabled.add(window.game.participantEnabledApp);
    gapi.hangout.onEnabledParticipantsChanged.add(window.game.participantsChanged);
  }
});

window.BlackJackGame = BlackJackGame;


