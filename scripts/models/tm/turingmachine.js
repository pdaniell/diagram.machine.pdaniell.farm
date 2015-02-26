'use strict';
/** 
 * Turing Machine model class. 
 * 
 * @author Paul Daniell <paul.d@mm.st>
 * 
 **/


define(["jquery", "underscore", "backbone", "kinetic", "models/state",
        "models/alphabet", "models/tm/tmtransitionfunction",
        "models/tm/tmcommand", "models/condition",
        "models/statetable", "models/tape", "utils/randomutils"], 
function($, _, Backbone, Kinetic, State, Alphabet, TMTransitionFunction,
		TMCommand, Condition, StateTable, Tape, RandomUtils){
	
	
	var TuringMachine = Backbone.Model.extend({
		
		defaults: {
			transitionFunction : null, 
			initialState : null, 
			initialPosition:0, 
			tape: null, 
			currentPosition: 0,
			currentState: null, 
			isHalted: false, 
			executionSteps: 0, 
			alphabet: Alphabet.DEFAULT_BINARY
		}, 
		
		initialize: function(attributes, options){
			
			if(this.attributes.alphabet instanceof Alphabet == false){
				throw "Invalid alphabet"; 
			}
			
			this.alphabet = this.attributes.alphabet; 
			this.blank = this.getAlphabet().getBlank(); 
			this.isHalted = this.attributes.isHalted;
			this.currentPosition  = this.attributes.initialPosition; 
			this.currentState = this.attributes.iniitalState; 
			
			this.initialPosition = this.attributes.initialPosition; 
			this.initialState = this.attributes.initialState; 
			
			
			this.tape = new Tape({alphabet:this.alphabet, 
								chars:this.getAlphabet().getBlank()});
			this.stateTable = new StateTable(); 
			this.transitionFunction = new TMTransitionFunction(
					{alphabet:this.alphabet,	stateTable:this.stateTable}); 
			this.executionSteps = this.attributes.executionSteps; 
		
		}, 
		
		addState: function(label, isAccepting){
			if(this.stateTable.getStateFromLabel(label) != null){
				throw "Label already exists."; 
			}
			
			var x = RandomUtils.randomInt(0, $("#diagram").width()); 
			var y = RandomUtils.randomInt(0, $("#diagram").height());
			var state = new State({label:label, 
								isAccepting:isAccepting, 
								x: x, 
								y:y}); 
			this.stateTable.add(state); 
			
			return state; 
			
		}, 
		
		
		removeStateByLabel: function(label){
			
			//remove this from the state table 
			this.stateTable.remove(label); 
			
		},
		
		removeTransitionByCondition: function(condition){
			this.transitionFunction.removeTransitionByCondition(condition); 
		}, 
		
		alterIsAccepting: function(label, isAccepting){
			var state = this.stateTable.getStateFromLabel(label); 
			state.setIsAccepting(isAccepting); 
		}, 

		toggleIsAccepting: function(label){
			var state = this.stateTable.getStateFromLabel(label); 
			var isAccepting = !state.getIsAccepting(); 
			this.alterIsAccepting(label, isAccepting);
		}, 
		
		setInitialStateByLabel: function(label){
			if(label == null){
				this.initialState = null;
				return; 
			}
			var state = this.stateTable.getStateFromLabel(label); 
			this.initialState = state; 
			this.currentState = state; 
		},
		
		
		getTransitionDescriptions: function(){
			return this.transitionFunction.getTransitionDescriptions(); 
			
		}, 
		
		getTransitionCommandLabelByCondition: function(condition){
			return this.transitionFunction.getCommand(condition).state.label; 
			
		}, 
		
		getLabels: function(){ 
			var labels = [];
			var machine = this; 
			
			this.stateTable.stateMap.each(function(key,val){

				if(val.isAccepting){
					if(machine.initialState != null && machine.initialState.getLabel() == key){ 

						labels.push("*"+ key + "*");
					} else {
						labels.push(key + "*");
					}
				} else {
					if(machine.initialState != null &&  machine.initialState.getLabel() == key){ 

						labels.push("*"+ key);
					} else {
						labels.push(key);
					}
				}
			});
			return labels; 
		}, 
		
		addTransition: function(conditionLabel, conditionCharacter,
				commandLabel, commandType, commandParameter){
			
			var conditionState = 
				this.stateTable.getStateFromLabel(conditionLabel); 
			
			if(conditionState == null){
				throw "Invalid condition state."; 
			}
			
			var condition = new Condition({state:conditionState, 
								character: conditionCharacter}); 
			var commandState = 
				this.stateTable.getStateFromLabel(commandLabel);
			
			var command = new TMCommand({state: commandState, 
				command: commandType, parameter: commandParameter}); 
			
			
			this.getTransitionFunction().add(condition, command);
			
			return condition; 
			
		}, 
		
		setTapeContents: function(chars){
			this.tape.setChars(chars); 
		}, 
		
		setInitialState: function(initialState){ 
			this.initialState = initialState; 
		},
		
		setCurrentState: function(currentState){
			this.currentState = currentState; 
		}, 
		
		getTransitionFunction: function(){
			return this.transitionFunction; 
		}, 
		
		getStateTable: function(){
			return this.getTransitionFunction().getStateTable(); 
		}, 
		
		getTape: function(){
			return this.tape; 
		},
		
		getBlank: function(){ 
			return this.blank; 
		},
		
		getAlphabet: function(){
			return this.alphabet; 
		}, 
		
		getCurrentPosition: function() {
			return this.currentPosition; 
		}, 
		
		getCurrentState: function(){
			return this.currentState; 
		}, 
		
		getExecutionSteps: function(){
			return this.executionSteps; 
		},
		
		getIsHalted: function(){
			return this.isHalted; 
		}, 

		setTransitionFunction: function(transitionFunction){
			if(transitionFunction instanceof TMTransitionFunction == false) {
				throw "Invalid transition function."; 
			}
			this.transitionFunction = transitionFunction;  
		}, 
		
		setInitialPosition: function(pos){
			this.initialPosition = pos; 
		}, 
		
		setTape: function(tape){
			if(tape instanceof Tape == false) {
				throw "Invalid tape."; 
			}
			
			this.tape = tape; 
		},
		
		setAlphabet: function(alphabet){
			if(alphabet instanceof Alphabet == false) {
				throw "Invalid alphabet."; 
			}
			return this.alphabet = alphabet; 
		}, 

	    characterDisplay: function(){
	    	var s = ""; 
	        
	    	//header
	    	for(var i  = 0; i < this.tape.chars.length; i++){ 
	            s = s + "====="; 
	        }
	        
		    s = s + "\n"; 
		    
		    //tape contents
		    s += "|";
		    for(var i  = 0; i < this.tape.chars.length; i++){
		    	var character = this.tape.chars.charAt(i); 
		    	
		    	if (i == this.getCurrentPosition()) {
		    		s = s + "*"+  character;
		    	} else {
		    		s = s + " "+  character;
		    	}
		    	s = s + " |"; 
		    }
		    
		    //footer 
		    s = s + "\n";
		   	for(var i  = 0; i < this.tape.chars.length; i++){ 
	            s = s + "====="; 
	        }
		   	
		    s = s + "\n";
		    
	        var haltedString = "";
	        if(this.getIsHalted() == true) {
	            haltedString = "yes"; 
	        }
	        else {
	            haltedString = "no"; 
	        }
	        
	        var label; 
	        if(this.currentState == null){
	        	label = "*";
	        } else {
	        	label = this.currentState.getLabel(); 
	        }
	        
	        s += "p:" + this.currentPosition  + ", s:" + 
	        label + ", h:" + haltedString +
	        ", x:" + this.executionSteps;
	        return s; 
	        		  
	    },
		
		step: function(){
	    	if(this.getIsHalted() == true) {
	    		return; 
	    	}
	    	
	    	//reconstruct the condition and command
	    	var currentCharacter = 
	    		this.getTape().charAt(this.getCurrentPosition());
	    	
	    	console.log(currentCharacter); 
	    	
	    	var currentCondition = 
	    		new Condition({state:this.getCurrentState(), 
	    			character:currentCharacter});
	    	
	    	console.log(currentCondition); 
	    	
	    	
	    	var transitionCommand = 
	    		this.getTransitionFunction().getCommand(currentCondition); 

	    	console.log(this.transitionFunction.requireTotal); 
	    	
	    	if(transitionCommand == null && this.transitionFunction.requireTotal == false){
	    		this.isHalted = true; 
	    		return; 
	    	}
	    	
	    	
	    	//execute the command
	    	if (transitionCommand.getCommand() == TMCommand.NOOP) {
	    		return; 
	    	} else if(transitionCommand.getCommand() 
	    			== TMCommand.MOVE_LEFT) {
	    		
	    		if(this.getCurrentPosition() == 0) {
	    			this.getTape().prepend(this.getBlank());
	    		} else { 
	    			this.currentPosition = this.currentPosition - 1;
	    		}
	    	} else if(transitionCommand.getCommand()
	    			== TMCommand.MOVE_RIGHT) {
	    	
	    		if(this.getCurrentPosition() >= this.getTape().length() -1) {
	    			this.getTape().append(this.getBlank()); 
	    		} 
	    		this.currentPosition = this.currentPosition + 1; 
	    	} else if(transitionCommand.getCommand()
	    			== TMCommand.WRITE) {
	    		
	    		var character = transitionCommand.getParameter(); 
	    		if(character == null) {
	    			throw "Missing parameter for write."; 
	    		}
	    		
	    		this.getTape().alter(this.currentPosition, character); 
	    	} else if(transitionCommand.getCommand()
	    			== TMCommand.ERASE) {
	    		this.getTape().alter(this.currentPosition, this.getBlank()); 
	    	}
	    	
	    	this.executionSteps = this.executionSteps + 1; 
	    	
	    	this.currentState = transitionCommand.getState(); 
	    	if(this.currentState.getIsAccepting() == true) {
	    		this.isHalted = true; 
	    	}
	    	
	    	
	    }, 
		
		run: function(stepCount){
	    	if(stepCount < 0) {
	    		while(this.isHalted == false) {
	    			this.step(); 
	    		}
	    	}
	    	
	    	for (var i = 0; i < stepCount;  i++) {
	    		this.step(); 
	    	}
	    	
	    	
	    	
	    }
		
	}); 
	
	
	return TuringMachine; 
	
}); 

