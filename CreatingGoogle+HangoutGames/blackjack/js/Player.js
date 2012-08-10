function Player() {
  if ( !(this instanceof arguments.callee) ) {
  	 return new arguments.callee(arguments); 
  }
	
	var self = this; 

	var isComputer = false;
	var currentHand = 0;
	self.init = function () {
		// For now there is only one
		// but there could be multiples 
		// splitting is implemented 
		self.hands = [new Hand()];
	}

	self.init(); 
}
