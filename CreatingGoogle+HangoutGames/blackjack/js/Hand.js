function Hand() {
  if ( !(this instanceof arguments.callee) ) {
  	 return new arguments.callee(arguments); 
  }
  
  var self = this;
  
  self.init = function () {
  	self.cards = [ ]
  }
  
  self.addToHand = function (card) {
  	// Set card position
		if (self.cards.length+1 > 1) {
			var previousCard = self.cards[self.cards.length-1]
			card.setX(previousCard.getX() + self.offset);
			card.setY(previousCard.getY() + self.offset);	
		}
		self.cards.push(card);
  }
  
  self.addAll = function (array) {
    for (var i = 0; i < array.length; i++) {
        self.cards.push(array[i]);    
    }
  }
  self.offset = 15;	
	
 /**
	* Draw first card face down and subsequent cards face up.
	* Decrement x and increment y to layer cards 
	*/
	self.drawHand = function (size) {
		console.log("here");
		for (var i = 0; i < self.cards.length; i++) {
			var card = self.cards[i];
			if (i == 0)
				card.drawFront(size);
			else card.drawFront(size);
		}
	}
  
  self.playCard = function () {
    // Returns the card from the front of the deck;
  }
  
  
            
  self.init();
}                                                

window.Hand = Hand;                                               
