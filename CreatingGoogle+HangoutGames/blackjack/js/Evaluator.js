var Evaluator = function() {
	if ( !(this instanceof arguments.callee) ) {
		return new arguments.callee(arguments);
	}

	var self = this;
	self.dealerHand = null;
	self.setDealer = function(hand) { self.dealerHand = hand; };

	self.isBust = function (hand) {
		var totals = self.getHandTotals(hand)
		return _.all(totals, function(num) {return num > 21;})
	}

	self.shouldHit = function(hand) {
		var totals = self.getHandTotals(hand);
		var hasAce = _.find(hand.cards, function(card) { return card.ord == '1' });
		if (hasAce != undefined) {
			if (totals[1] == 18 && self.evalDealerUpCard([1,9,10])) {
				return true;
			}	else if (totals[1] == 17 && self.evalDealerUpCard([2,7,8,9,10,1])) {
				return true;
			} else if ((totals[1] == 15 || totals[1] == 16) && self.evalDealerUpCard(2,3,7,8,9,10,1)) {
				return true;
			} else if ((totals[1] == 13 || totals[1] == 14) && self.evalDealerUpCard(2,3,4,7,8,9,10,1)) {
				return true;
			}

		} else {
			if (((totals[0] <= 16 && totals[0] >=12) || (totals[0] == 9)) && self.evalDealerUpCard([1,7,8,9,10])) {
				return true;
			} else if (totals[0] == 12 && self.evalDealerUpCard([2,3])) {
				return true;
			} else if (totals[0] == 11 && self.evalDealerUpCard([1])) {
				return true;
			} else if (totals[0] == 10 && self.evalDealerUpCard([1,10])) {
				return true;
			} else if (totals[0] == 9 && self.evalDealerUpCard([2])) {
				return true;
			} else if (totals[0] >=5 && totals[0] <= 8) {
				return true;
			}
		}
		return undefined;
	}

	self.isHardTotal = function(hand) {
		var hasAce = _.find(hand.cards, function(card) { return card.ord == '1' });
		if (hasAce != undefined) {
			return false;
		} else return true;
	}

	self.getDealerUpCard = function() {
		return _.last(self.dealerHand.cards)
	}

	self.evalDealerUpCard = function(nums) {
		var upCard = self.getDealerUpCard();
		var found = _.find(nums, function(n) {return n == upCard.val})
		if (found != undefined)
			return true
		else return false
	}

	self.shouldStay = function(hand) {
		var totals = self.getHandTotals(hand);
		var isHard = self.isHardTotal(hand);
		var upCard = self.getDealerUpCard();
		if (isHard) {
			if (totals[0] >= 17 && totals[0] <= 20) {
				return true;
			}	else if (totals[0] >= 13 && totals[0] <= 16 && self.evalDealerUpCard([2,3,4,5,6])) {
				return true;
			} else if (totals[0] == 12 && self.evalDealerUpCard([4,5,6])) {
					return true;
			}
		} else { // is soft
			if (totals[1] == 19 || totals[1] == 20) {
				return true;	
			} else if (totals[1] == 18 && self.evalDealerUpCard([2,7,8])) {
				return true;
			}
		} 
		return undefined;
	}

	self.shouldDoubleDown = function(hand) {
		var totals = self.getHandTotals(hand);
		var isHard = self.isHardTotal(hand);
		if (isHard) {
			if (totals[0] == 11 && self.evalDealerUpCard([2,3,4,5,6,7,8,9,10])) {
				return true;
			} else if (totals[0] == 10 && self.evalDealerUpCard([2,3,4,5,6,7,8,9])) {
				return true;
			} else if (totals[0] == 9 && self.evalDealerUpCard([3,4,5,6])) {
				return true;
			}
		} else {
			if (totals[1] == 18 && self.evalDealerUpCard([3,4,5,6])) {
				return true;
			} else if (totals[1] == 17 && self.evalDealerUpCard([3,4,5,6])) {
				return true;
			} else if ((totals[1] == 15 || totals[1] == 16) && self.evalDealerUpCard([4,5,6])) {
				return true;
			} else if ((totals[1] == 13 || totals[1] == 14) && self.evalDealerUpCard([5,6])) {
				return true;
			}			
		}
		return undefined;
	}

	self.getHandTotals = function(hand) {
		var totals = []
		var lowValue = 0
		for (var i = 0; i < hand.cards.length; i++) {
			var card = hand.cards[i];
			lowValue += card.val;	
		}
		totals.push(lowValue)
		var hasAce = _.find(hand.cards, function(card) { return card.ord == '1' });
		if (hasAce != undefined) {
			var newTotal = lowValue + 10;
			if (newTotal <= 21)
				totals.push(newTotal);
		}
		return totals
	}	
}

