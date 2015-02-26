'use strict';
/**
 * String Utility functions. 
 *
 * Author: Paul Daniell <paul.d@mm.st>
 *
 **/
 
define([], function () {
	var RandomUtils =  {
        randomInt: function(min,max){ 
            return Math.floor((Math.random()*(max- min)) + min); 
        }
	
		
	};

    return RandomUtils; 
});
