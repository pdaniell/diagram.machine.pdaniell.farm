'use strict';
/**
 * String Utility functions. 
 *
 * Author: Paul Daniell <paul.d@mm.st>
 *
 **/
 
define([], function () {
	var StringUtils =  {
        reverse: function(s){ 
            return s.split("").reverse().join("");
        }, 
        
        replaceCharAt: function(s, index, character){
   	      return s.substr(0, index) + character + s.substr(index+character.length);
        }
	
		
	};

    return StringUtils; 
});
