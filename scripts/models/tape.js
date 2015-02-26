'use strict';
/* 
 * Tape model class. Used to represent the tape of a Turing Machine. 
 * 
 * Author: Paul Daniell <paul.d@mm.st>
 * 
 */

define(["jquery", "underscore", "backbone", "models/alphabet", 
        "utils/stringutils"], 
function($, _, Backbone, Alphabet, StringUtils){

   var Tape = Backbone.Model.extend({
  
        defaults: {
            alphabet: Alphabet.DEFAULT_BINARY, 
            chars: "0"
        },

        initialize:function(attributes, options){

        	this.setAlphabet(this.attributes.alphabet);
            this.setChars(this.attributes.chars);
    
        },
        
        getAlphabet: function(){
        	return this.alphabet; 
        }, 
        
        getChars: function(){
        	return this.chars; 
        }, 
        
        setAlphabet: function(alphabet){
            if(alphabet instanceof Alphabet == false){
                throw "Invalid type for alphabet"; 
            }
            
            this.alphabet = alphabet; 
        }, 
        
        setChars: function(chars){
	        if(this.alphabet.isCompatibleWith(chars) == false){
	            throw "Incompatible alphabet for contents.";            
	        }
	       
	        this.chars = chars; 
	    }, 
	    
	    length: function(){
	    	return this.chars.length; 
	    }, 
	    
	    charAt: function(index){
	    	return this.chars.charAt(index); 
	    },
	    
	    hasCharAt: function(pos){
	    	if(pos < 0){ 
	    		return false;  
	    	}
	    	
	    	if(pos >= this.chars.length){
	    		return false;  
	    	}
	    	
	    	return true; 
	    	
	    		
	    }, 
	    
	    prepend: function(s){
	    	this.chars = s + this.chars; 
	    }, 
	    
	    append: function(s) { 
	    	this.setChars(this.chars + s); 
	    }, 
	    
	    alter: function(pos, c){
	    	if (c.length != 1){
	    		throw "Invalid length.";  
	    	}
	    	
	    	this.chars = StringUtils.replaceCharAt(this.chars, pos,c); 
	    },
	    
	    characterDisplay: function(){
	    	var s = ""; 
	        
	    	//header
	    	for(var i  = 0; i < this.chars.length; i++){ 
	            s = s + "====="; 
	        }
	        
		    s = s + "\n"; 
		    
		    //tape contents
		    s += "|";
		    for(var i  = 0; i < this.chars.length; i++){
		    	var character = this.chars.charAt(i); 
		    	s = s + " "+  character;
		    	s = s + " |"; 
		    }
		    
		    //footer 
		    s = s + "\n";
		   	for(var i  = 0; i < this.chars.length; i++){ 
	            s = s + "====="; 
	        }
	        		    
		    return s;
	    }
	    
        

    }); 

    return Tape; 
}); 
