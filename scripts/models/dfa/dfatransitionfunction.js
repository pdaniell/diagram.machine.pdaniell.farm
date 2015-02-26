'use strict';
/** 
 * DFA Transition Function. 
 * 
 * @author: Paul Daniell <paul.d@mm.st>
 * 
 * 
 */

define(["jquery", "underscore", "backbone", "utils/hashtable",
        "models/statetable", "models/Alphabet" ], 
function($, _, Backbone, Hashtable, StateTable, Alphabet){

   var DFATransitionFunction = Backbone.Model.extend({
  
        defaults: {
            map:  null, 
            stateTable: null,  
            alphabet: Alphabet.DEFAULT_BINARY, 
            requireTotal: false
        },

        initialize:function(attributes, options){
            this.map = new Hashtable(); // this.attributes.map; 
            this.setStateTable(new StateTable()); 
            this.setAlphabet(this.attributes.alphabet); 
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
                     
            
            if(command instanceof DFACommand == false){
                throw "Invalid command."; 
            }
            
            //check to see if 
            
            if(this.stateTable.contains(command.getState()) == false){
            	throw "Invalid state for command.";
            }
            
            
            this.map.put(condition, command); 
            
        }, 
        
        getCommand: function(condition){
        	if(this.map.containsKey(condition) == false 
        			&& this.requireTotal == true){
        		throw "Missing transition condition."; 
        	}
        	
            return this.map.get(condition);
        }, 
        
        getAlphabet: function(){
        	return this.alphabet; 
        }, 
        
        getStateTable: function(){
        	return this.stateTable; 
        },
        
        setAlphabet: function(alphabet){
        	if (alphabet instanceof Alphabet == false){
        		throw "Invalid alphabet."; 
        	}
        	this.alphabet = alphabet; 
        }, 
        
        setStateTable: function(stateTable){
        	if (stateTable instanceof StateTable == false){
        		throw "Invalid State Table."; 
        	}
        	this.stateTable = stateTable; 
        }
        
        
        

    }); 

    return DFATransitionFunction; 
}); 
