'use strict';
/**
 * Alphabet Counter. . 
 *
 * Author: Paul Daniell <paul.d@mm.st>
 *
 **/
 
define([], function () {
	var AlphabetCounter =  function() {
		this.index =0;
	};
	
	
	AlphabetCounter.prototype.getNext = function(){ 
		this.index++;
		return this.toLetters(this.index); 
	}; 
	
	AlphabetCounter.prototype.toLetters = function(num) {
	    "use strict";
	    var mod = num % 26,
	        pow = num / 26 | 0,
	        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
	    return pow ? this.toLetters(pow) + out : out;
	}
	
	return AlphabetCounter; 
}); 