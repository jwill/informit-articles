var CachedImageView = function (image, width, height) {
		if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
	
    var self = this;		

	self.img = image;
    self.loaded = true;
    self.width = 10;
    self.height = 10;
    
    //@property x  The Y coordinate of the upper left corner of the image.
    self.x = 0.0;
    self.setX = function(x) { this.x = x;  return this;  };
    self.getX = function() { return this.x; };
    
    //@property y  The Y coordinate of the upper left corner of the image.
    self.y = 0.0;
    self.setY = function(y) {  this.y = y;  return this;  };
    self.getY = function() { return this.y; };
    
    
    self.hasChildren = function() { return false; }
    
    self.width = width;
    self.height = height;
    
    self.draw = function(size) {
        if(self.loaded) { 
						if (size == undefined) 
            	game.getContext().drawImage(self.img,self.x,self.y);
						else game.getContext().drawImage(self.img, self.x, self.y, self.width*size, self.height*size);
        } else {
            game.getContext().fillStyle = "red";
            game.getContext().fillRect(self.x,self.y,100,100);
        }
    };

		
    self.contains = function(x,y) {
        if(x >= this.x && x <= this.x + this.width) {
            if(y >= this.y && y<=this.y + this.height) {
                return true;
            }
        }
        return false;
    };
    return true;
};
