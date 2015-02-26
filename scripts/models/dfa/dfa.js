'use strict';
/** 
 * Deterministic Finite Automaton model class. 
 * 
 * @author Paul Daniell <paul.d@mm.st>
 * 
 */

define(["jquery", "underscore", "backbone", "models/state",
        "models/alphabet", "models/dfa/dfaransitionfunction",
        "models/dfacommand", "models/condition",
        "models/statetable", "models/tape"], 
function($, _, Backbone, State, Alphabet, DFATransitionFunction,
		DFACommand, Condition, StateTable, Tape){
	
	
	var DFA = Backbone.Model.extend({
        defaults: {
        	tape: null, 
        	transitionFunction: null, 
        	initialState: null
    	},
    	
		initialize: function(atttributes, options){}, 
		
		characterDisplay: function(){}, 
		
		step: function(){}, 
		
		run: function(){}

		
	}); 
	
	
	return DFA; 
	
}); 

