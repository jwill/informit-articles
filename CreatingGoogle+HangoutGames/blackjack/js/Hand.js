var Hand = function() {
	this.init();
};

Hand.prototype.init = function () {
  	this.cards = [ ];
    this.offset = 15;
    this.startPosition = {'x':0, 'y':0};
}

Hand.prototype.addToHand = function (card) {
  	// Set card position
		if (this.cards.length+1 > 1) {
			var previousCard = this.cards[this.cards.length-1]
			card.setX(previousCard.getX() + this.offset);
			card.setY(previousCard.getY() + this.offset);	
		} else if (this.cards.length == 0) {
      card.setX(this.startPosition.x);
			card.setY(this.startPosition.y);
    }
		this.cards.push(card);
}

// Set the position of the first card 
// Recursively set the others
Hand.prototype.setPosition = function (x,y) {
    this.startPosition = {'x':x,'y':y};
    if (this.cards.length > 1) {
      var card = this.cards[0];
      card.setX(this.startPosition.x);
      card.setY(this.startPosition.y);
      for (var i = 1; i<this.cards.length; i++) {
        var c = this.cards[i]
        var previousCard = this.cards[i-1];
        c.setX(previousCard.getX() + this.offset);
        c.setY(previousCard.getY() + this.offset);
      }
      console.log('repositioned cards');
    }
}

Hand.prototype.addAll = function (array) {
    for (var i = 0; i < array.length; i++) {
        this.cards.push(array[i]);    
    }
}

Hand.prototype.drawHand = function (context, size) {
		for (var i = 0; i < this.cards.length; i++) {
			var card = this.cards[i];
			if (i == 0)
				card.drawFront(context, size);
			else card.drawFront(context,size);
		}
}
  
Hand.prototype.getState = function () {
	  var cardsArray = [];
	  for (var i=0; i<this.cards.length; i++) {
		  var card = this.cards[i];
		  cardsArray.push(card.toString());
	  }
	  return cardsArray;
}

window.Hand = Hand;                                               
