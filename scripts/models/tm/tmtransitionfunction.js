'use strict';
/* 
 * Turing Machine Transition Function. 
 * 
 * Author: Paul Daniell <paul.d@mm.st>
 * 
 */

define(["jquery", "underscore", "backbone", "utils/hashtable",
        "models/statetable", "models/alphabet", "models/condition", 
        "models/tm/tmcommand", "models/state"], 
function($, _, Backbone, Hashtable, StateTable, Alphabet, Condition,
		TMCommand, State){

   var TMTransitionFunction = Backbone.Model.extend({
  
        defaults: {
            map:  null, 
            stateTable: null, 
            alphabet: Alphabet.DEFAULT_BINARY,
            requireTotal: false
        },

        initialize:function(attributes, options){
            this.map = new Hashtable();  
            this.stateTable = this.attributes.stateTable; 
            this.alphabet = this.attributes.alphabet; 
            this.requireTotal = this.attributes.requireTotal; 
        },

        add: function(condition, command){
            
            if(condition instanceof Condition == false){
                throw "Invalid condition."; 
            }
            
            if(this.stateTable.contains(condition.getState()) == false){
            	throw "Invalid state for condition."; 
            }
            
            if(this.alphabet.contains(condition.getCharacter()) == false){
            	throw "Invalid character for condition given alphabet"; 
            }
                     
            
            if(command instanceof TMCommand == false){
                throw "Invalid command."; 
            }
            
            //check to see if 
            
            if(this.stateTable.contains(command.getState()) == false){
            	throw "Invalid state for command.";  
            }
            
            if(command.getCommand() == TMCommand.WRITE &&
            		this.alphabet.contains(command.getParameter()) == false){
            	throw "Invalid parameter for command." ; 
            }
            
            
            this.map.put(JSON.stringify(condition), command); 
            
            return condition; 
            
        }, 
        
        removeTransitionByCondition: function(condition){
        	this.map.remove(JSON.stringify(condition)); 
        }, 
        
        getCommand: function(condition){
        	if(this.map.containsKey(JSON.stringify(condition)) == false 
        			&& this.requireTotal == true){
        		throw "Missing transition condition."; 
        	}
        	
            return this.map.get(JSON.stringify(condition));
        }, 
        
        getAlphabet: function(){
        	return this.alphabet; 
        }, 
        
        getStateTable: function(){
        	return this.stateTable; 
        },
        
        getConditions: function(){
        	var list = this.map.keys(); 
        	var toReturn = []; 
        	for (var i = 0; i < list.length; i++){
        		
        		var obj = $.parseJSON(list[i]); 
        		var state = new State({label: obj.state.label, 
        			isAccepting: obj.state.isAccepting, 
        			x: obj.state.x, y: obj.state.y, 
        			w: obj.state.w, h: obj.state.h, 
        			isVisible: obj.state.isVisible}); 
        		
        		var condition = new Condition({state: state, 
        			character: obj.character}); 
        		toReturn[i] = condition;
        	}
        	return toReturn; 
        	
        	
        }, 
        
        setAlphabet: function(alphabet){ 
        	this.alphabet = alphabet; 
        }, 
        
        setStateTable: function(stateTable){ 
        	this.stateTable = stateTable; 
        }, 
        
        getTransitionDescriptions: function(){
        	var descriptions = []; 
        	
        	this.map.each(function(key,val){
        		var result = JSON.parse(key); 
        		var str = "(" + result.state.label + ":" + result.character + ")" + "->" + val.toString();
        		
        		descriptions.push(str); 
        	}); 
        	return descriptions; 
        	
        }
        
        
        

    }); 

    return TMTransitionFunction; 
}); 
