'use strict';
/* 
 * Tape model class. Used to represent the tape of a Turing Machine. 
 * 
 * Author: Paul Daniell <paul.d@mm.st>
 * 
 **/

define(["jquery", "underscore", "backbone", 
        "models/state", "utils/hashset", "utils/hashtable" ], 
function($, _, Backbone, State, Hashset, Hashtable){

   var StateTable = Backbone.Model.extend({
  
        defaults: {
            stateMap: null, 
            acceptingStates: null,  
            controlStates: null 
        },

        initialize:function(attributes, options){
            this.stateMap = new Hashtable();  
            this.acceptingStates = new Hashset();  
            this.controlStates = new Hashset();  
        },


        add: function(state){
        	
            if(state instanceof State == false){
                throw "Object invalid for adding to state table.";            
            }

            if (state.getIsAccepting() == true){
                this.acceptingStates.add(state);
            } else{ 
                this.controlStates.add(state);
            }
            
            this.stateMap.put(state.getLabel(), state); 
        }, 
        
        remove: function(label){ 
        	var state = this.getStateFromLabel(label); 
        	this.stateMap.remove(label); 
        	if(this.acceptingStates.contains(state)){
        		this.acceptingStates.remove(state); 
        	}
        	
        	
        	if(this.controlStates.contains(state)){
        		this.controlStates.remove(state); 
        	}
        	
        }, 

        getControlStates: function(){ 
            return this.controlStates;
        },

        getStateFromLabel: function(label) {
	         return this.stateMap.get(label);
        },
        
        contains: function(state){
        	if(this.stateMap.containsValue(state)){
        		return true; 
        	}
        	return false; 
        }, 
        
        length: function(){ 
        	return this.stateMap.keys().length; 
        }, 
        
        labels: function(){ 
        	return this.stateMap.keys(); 
        }

    }); 

    return StateTable; 
}); 
