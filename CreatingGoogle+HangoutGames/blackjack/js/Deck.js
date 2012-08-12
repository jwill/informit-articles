/*
    Defines the Deck object.
    @author jwill
*/

function Deck(numDecks, ctx) {
    if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
    var cards;
    var self = this;
    
    self.init = function() {        
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
    	}
    	// TODO Handle case where you have to reshuffle deck
    	
    }
    
    self.lookupCard = function(value) {
    	for (var i = 0; i<window.deck.cards.length; i++) {
    		var card = window.deck.cards[i];
    		if (value.suit == card.suit && value.ord == card.ord) {
    			return card;
    		} 
    	}
    	return null;
    }
    
    self.dealCards = function(num) {
        var cards = new Array();
        for (var i = 0;  i<num ; i++) {
            cards.push(self.dealCard());
        }
        return cards;
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
