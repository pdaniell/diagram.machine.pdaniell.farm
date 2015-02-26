'use strict';
/* 
 * Transition Condition class. 
 * 
 * Author: Paul Daniell <paul.d@mm.st>
 * 
 */

define(["jquery", "underscore", "backbone", "models/state" ], 
function($, _, Backbone, State){

   var Condition = Backbone.Model.extend({
  
        defaults: {
            state: null, 
            character: null
        },

        initialize:function(attributes, options){
            this.state = this.attributes.state; 
            this.character = this.attributes.character; 
        },

        getState: function(){ 
            return this.state; 
        }, 

        getCharacter: function(){ 
            return this.character;
        }, 

        setState: function(state){ 
        	if(state instanceof State == false){
        		throw "Invalid condition state."; 
        	}
            this.state = state; 
        },

        setCharacter: function(character){ 
            this.character = character; 
        }, 
        
        toString: function(){ 
        	return "(" +  this.state.getLabel() + ":" + this.character  +")"; 
        	
        }
        
        
        

    }); 

    return Condition; 
}); 
