'use strict';
/* 
 * Turing Machine command. These objects make up 
 * the domain of the Turing Machine transition function.  
 * 
 * Author: Paul Daniell <paul.d@mm.st>
 * 
 */

define(["jquery", "underscore", "backbone", "models/state"], 
function($, _, Backbone, State){

   var TMCommand = Backbone.Model.extend({
  
        defaults: {
            state: null, 
            command: null, 
            parameter: null 
        },

        initialize:function(attributes, options){
            this.setState(this.attributes.state); 
            this.setCommand(this.attributes.command); 
            this.setParameter(this.attributes.parameter); 
        },

        getState: function(){ 
            return this.state; 
        }, 
        
        getCommand: function(){ 
            return this.command; 
        },
        
        getParameter: function(){ 
            return this.parameter; 
        },


        setState: function(state){ 
            if(state instanceof State == false){
            	throw "Invalid state."; 
            }
        	this.state = state; 
        },
        
        setCommand: function(command){
        	if(_.isNumber(command) == false){
        		throw "Invalid command"; 
        	}
        	
        	if(command > 4 || command <0){
        		throw "Invalid command"; 
        	}
        	
        	
            this.command = command; 
        },
        
        
        setParameter: function(parameter){
            this.parameter = parameter; 
        },

        toString: function(){
        	
        	return "(" + this.state.getLabel() + ":" + TMCommand.COMMAND_LIST[this.getCommand()]
        			+ ":" + this.getParameter() + ")"; 
        }
        

    }); 
   
   //some static variables.
   
   TMCommand.MOVE_LEFT = 0; 
   TMCommand.MOVE_RIGHT=1; 
   TMCommand.NOOP=2; 
   TMCommand.ERASE=3; 
   TMCommand.WRITE= 4;  
   
   TMCommand.COMMAND_LIST=["MOVE_LEFT", "MOVE_RIGHT", 
                           "NOOP", "ERASE", "WRITE"]; 

   	
    return TMCommand; 
}); 
