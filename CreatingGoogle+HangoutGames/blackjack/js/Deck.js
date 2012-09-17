/*
    Defines the Deck object.
    @author jwill
*/
backImage = new Image()
backImage.onload = function() {
  console.log("loaded");
}
window['root'] = "//ribbitwave.appspot.com/";
backImage.src = window['root'] + "images/45dpi/back.png";

function Deck(numDecks, ctx) {
    if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
    var cards;
    var self = this;
    
    self.init = function() {
        self.numDecks = numDecks;      
        self.cards = new Array(52 * numDecks);
        self.initCards();
    }
    
    self.initCards = function() {
        // Initialize the cards 
        var ordinals = ['1','2','3','4','5','6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        var vals = [1,2,3,4,5,6,7,8,9,10,10,10,10]
        var suits = ['club', 'spade', 'heart','diamond'];
        
        // Populate card array
        for (var k = 0; k<numDecks; k++) {
            for (var j = 0; j < suits.length; j++) {
                for (var i = 0; i < ordinals.length; i++) {
                    self.cards[ (i + (j*13) + (k*52)) ] = new Card(ordinals[i],vals[i], suits[j]); 
                }
            }
        }

        
        
        // Shuffle the decks
        self.shuffleDecks();
    }
    
    self.rand = function(max) {
            return Math.floor(Math.random()*max);
    }         
    
    self.shuffleDecks = function () {
        var swap = function(i,j) {
            var temp = self.cards[j];
            self.cards[j] = self.cards[i];
            self.cards[i] = temp;
        }
        
        for(var j = 0; j<numDecks; j++) {
            for(var i = (numDecks * 51); i>=0; i--) {
                var r = self.rand(i);
                swap(i,r);
            }
        }
    }
    
    /*self.dealCard = function() {
        if (self.cards.length > 0) {
            var card = self.cards.pop();
						card.ctx = self.ctx;
						return card;
				}
    }*/

    self.reshuffleDecks = function() {
      console.log('reshuffling decks...');
      var numDecks = JSON.parse(gapi.hangout.data.getValue('numDecks'));
      var deckData = JSON.parse(game.deck.toString());
      var newCards = [];

      _.times(numDecks, function() {
        _.each(deckData, function(c) {
          newCards.push(c);
        });
        newCards = _.shuffle(newCards);
      });
      var cardValue = JSON.parse(newCards.pop());
      var card = self.lookupCard(cardValue);          
      gapi.hangout.data.setValue('deck', JSON.stringify(newCards));
      return [card,newCards];
    };
    
    self.dealCard = function() {
    	// Get deck state object and parse it
    	groupDeck = gapi.hangout.data.getValue('deck');
    	groupDeckArray = JSON.parse(groupDeck);
    	if (groupDeckArray.length > 0) {
    		var cardValue = JSON.parse(groupDeckArray.pop());
    		// Do lookup for card
    		var card = self.lookupCard(cardValue);
    		if (card != null) {
    			// Save deck state
    			groupDeck = JSON.stringify(groupDeckArray);
    			gapi.hangout.data.setValue('deck', groupDeck)
    			return card;
    		}    	
      } else {
          return self.reshuffleDecks()[0];
      }	
    }

    

     self.dealCards = function(num) {
      // Get deck state object and parse it
    	groupDeck = gapi.hangout.data.getValue('deck');
    	groupDeckArray = JSON.parse(groupDeck);

      var cardList = [];

      if (groupDeckArray.length > num) {
        _.times(num, function() {
          var cardValue = JSON.parse(groupDeckArray.pop());
          var card = self.lookupCard(cardValue);
          cardList.push(card);
        });
      } else {
        var remaining = groupDeckArray.length;
        _.times(remaining, function() {
          var cardValue = JSON.parse(groupDeckArray.pop());
          var card = self.lookupCard(cardValue);
          cardList.push(card);
        });
        var shuffle = self.reshuffleDecks();
        cardList.push(shuffle[0]);
        var newCards = self.dealCards(num - remaining - 1);
        _.each(newCards, function(x){
          var cardValue = JSON.parse(shuffle[1].pop());
          var card = self.lookupCard(cardValue);
          cardList.push(card);
        });
        groupDeckArray = shuffle[1];
      }

      // Save deck state
      g = JSON.stringify(groupDeckArray);
      gapi.hangout.data.setValue('deck', g);


      return cardList;
    }

    
    self.lookupCard = function(value) {
    	for (var i = 0; i<52; i++) {
    		var card = self.cards[i];
    		if (value.suit == card.suit && value.ord == card.ord) {
    			return card.clone();
    		} 
    	}
    	return null;
    }
        
    self.toString = function() {
    	var c = [];
    	for(var i = 0; i<self.cards.length; i++) {
    		c.push(self.cards[i].toString());
    	}
    	return JSON.stringify(c);
    }
    
    self.init();
}
