'use strict'; 
/**
 * Diagram View
 * 
 * 
 * @author Paul Daniell <paul.d@mm.st>
 */ 

define(["jquery", "underscore", "backbone", "kinetic", 
        "models/state", "models/alphabet", "models/tape", "models/statetable",
        "utils/stringutils", "utils/hashtable", "utils/hashset",
        "models/tm/tmcommand", "models/dfa/dfacommand",
        "models/condition", "models/tm/tmtransitionfunction", 
        "models/tm/turingmachine", "diagram/diagram", "utils/alphabetcounter"], 
function($, _, Backbone, Kinetic, State, Alphabet, 
		Tape, StateTable, StringUtils, Hashtable, Hashset, 
		TMCommand, DFACommand,
		Condition, TMTransitionFunction, 
		TuringMachine, Diagram, AlphabetCounter) {

    var DiagramView = Backbone.View.extend({
    	
    	defaults: {
    		stage: null,
    		machine: null, 
    		map: null
    	},
    	    	
    	initialize:function(options){
    		var stage = this.stage = new Kinetic.Stage({
                container: "diagram",
                width: $("#diagram").width(),
                height: $("#diagram").height()
            });
    		
    		
    		var alphabetCounter = this.alphabetCounter = new AlphabetCounter(); 
    		var machine = this.machine = this.options.machine; 
    		var map = this.map = new Hashtable(); 
    		var selectedElement = this.selectedElement = null; 
    		var startVertex = this.startVertex = null; 
    		var selectedControlPoint = this.selectedControlPoint = null; 
    		
    		// Event Handlers 
    		// These are registered in the AppView. 
        	
    		// Add a New State to the Diagram   
    		// --------------------------------
    		this.addNewState = function(event) {
        		
        		var layer = new Kinetic.Layer(); 
        		var label = alphabetCounter.getNext(); 
        		

        		var state = machine.addState(label, false); 
        		
        		var vertex = new Diagram.Vertex({
        			id: "vertex-" + label, 
        			doubleStroke: false, 
        			label: label, 
        			x: state.x, 
        			y:state.y
        		}); 
        		

        		vertex.state = state; 
        		
        		vertex.inArcs = new Hashset(); 
        		
        		vertex.outArcs = new Hashset(); 
        		
        		vertex.layer = layer; 
        		
        		layer.add(vertex.getGroup()); 
        		stage.add(layer); 


        		// Event Handlers for the Vertex
            	
        		// This listener gives the vertex focus. 
        		
        		vertex.labelText.on("click", function(){
        			console.log(vertex); 
        			if(selectedElement == vertex){
        				selectedElement = null; 
        				vertex.setSelectionBorder(false); 
        			} else{
        				if(selectedElement != null){
        					
	    					if(selectedElement instanceof Diagram.Vertex){
	    						selectedElement.setSelectionBorder(false);
	    					}
	    					if (selectedElement instanceof Diagram.TransitionArc){
	    						selectedElement.toggleSelect(); 
	    					}
        				}
        				selectedElement = vertex; 
        			 	vertex.setSelectionBorder(true);
        			}
        		});
        		
        		// Add the event listeners to the controlPoints
        		
        		for(var i = 0; i < vertex.controlPoints.length; i++){
        			var cp = vertex.controlPoints[i]; 
        			
        			cp.getElement().on("click", function(event){
        				if (selectedControlPoint == null){
        					// We're starting a transition arc. 
        					selectedControlPoint = this.controlPoint;
        				} else {
        			 		var layer = new Kinetic.Layer(); 
        					var startPoint = selectedControlPoint; 
        					
        					var endPoint = this.controlPoint;
        					
        					
        		    		var transitionArc = new Diagram.TransitionArc({
        		    			id: startPoint.getId() + "->" + endPoint.getId(), 
        		    			label: machine.getAlphabet().getBlank() + ":" + machine.getAlphabet().getBlank(),   
        		    			start: startPoint,
        		    			end: endPoint
        		    			                                            			
        		    		});

        		    		var condition = machine.addTransition(startPoint.vertex.label,
        		    				machine.getAlphabet().getBlank(), 
        		    				endPoint.vertex.label, 
        		    				TMCommand.WRITE, 
        		    				machine.getAlphabet().getBlank()); 

        		    		transitionArc.condition = condition; 
        		    		
        		    		startPoint.vertex.outArcs.add(transitionArc);
        		    		endPoint.vertex.inArcs.add(transitionArc);  
        		    		
        		    		
        		    		transitionArc.arcLabel.getElement().on("click", function(event){
        		    			
        		    			if(selectedElement == this.arcLabel.arc){
        		    				this.arcLabel.arc.toggleSelect(); 
        		    				selectedElement = null; 
        		    				return; 
        		    			} else {
        		    				
        		    				if(selectedElement != null){
        		    					if(selectedElement instanceof Diagram.Vertex){
        		    						selectedElement.setSelectionBorder(false);
        		    					}
        		    					if (selectedElement instanceof Diagram.TransitionArc){
        		    						selectedElement.toggleSelect(); 
        		    					}
        		    				}
        		    				
    		    					
    		    					selectedElement = this.arcLabel.arc; 
            		    			this.arcLabel.arc.toggleSelect(); 
        		    				
        		    			}
        		    			
        		    			
        		    			
        		    		}); 
        		    		
        		    		selectedControlPoint = null; 
        		    		endPoint.toggleSelect(); 
        		    		startPoint.toggleSelect(); 
        		    		startPoint.vertex.toggleControlPoints(false); 
        		    		
        					layer.add(transitionArc.getElement());
        					stage.add(layer); 
        					stage.draw(); 
        					
        					console.log(machine.getTransitionDescriptions());
        					
        				}
        			}); 
        		}
        		
        		
        		// Draw the stage
        		stage.draw(); 

				console.log(machine.getLabels()); 
        		
        	};
        	
        	// Delete an element from the Diagram 
        	// ----------------------------------
        	this.deleteSelectedElement = function(event){ 
        		if(selectedElement != null){ 
        			
        			if(selectedElement instanceof Diagram.Vertex){
        				
        				
        				//first iterate through all the inArcs
        				//deleting them 
        				
        				var inArcsValues = selectedElement.inArcs.values();
        				var outArcsValues = selectedElement.outArcs.values();
        				
        				
        				
        				for(var i = 0; i < inArcsValues.length; i++){
        					var inArc = inArcsValues[i]; 
        					var inArcCondition = inArc.condition; 
        					machine.removeTransitionByCondition(inArcCondition);
        					
        					var startVertex = inArc.start.vertex; 
        					var endVertex = inArc.end.vertex;
        					
        					startVertex.outArcs.remove(inArc); 
        					endVertex.inArcs.remove(inArc); 
        					
        					inArc.remove(); 
        					
        				}
        				
        				
        				for(var i = 0; i < outArcsValues.length; i++){
        					var outArc = outArcsValues[i]; 
        					var outArcCondition = outArc.condition; 
        					machine.removeTransitionByCondition(outArcCondition);
        					
        					var startVertex = outArc.start.vertex; 
        					var endVertex = outArc.end.vertex;
        					
        					startVertex.outArcs.remove(outArc); 
        					endVertex.outArcs.remove(outArc); 
        					
        					outArc.remove(); 
        					
        				}
        				
        				// remove all the outbound and inbound transitions
        				
        				machine.removeStateByLabel(selectedElement.state.getLabel());
        				
        				// now remove the transitionArc from the diagram
        				
        				selectedElement.getGroup().removeChildren(); 
        				stage.draw(); 
        				selectedElement = null;
        				
        				console.log(machine.getLabels());
        				

        				console.log(machine.getTransitionDescriptions());
        				
        				
        			}
        			
        			if(selectedElement instanceof Diagram.TransitionArc){
        				
        				var selectedCondition = selectedElement.condition;
        				// we have to remove the transition from the 
        				// inArcs and outArcs collections in the starting
        				// and ending vertices
        				
        				
        				
        				var startVertex = selectedElement.start.vertex; 
        				var endVertex = selectedElement.end.vertex; 
        				
        				startVertex.outArcs.remove(selectedElement); 
        				endVertex.inArcs.remove(selectedElement); 
        				
        				machine.removeTransitionByCondition(selectedCondition); 
        				selectedElement.remove();  
        				stage.draw(); 
        				selectedElement = null;
        				
        				console.log(machine.getTransitionDescriptions());
    					
        				
        				
        				
        			}
        			
        		}
        		
        	}; 
        	
        	// Toggle the accepting status of a machine state
        	//------------------------------------------------
        	
        	this.toggleAcceptingState = function(event){
        		if(selectedElement != null){ 
        			if(selectedElement instanceof Diagram.Vertex){ 
        				machine.toggleIsAccepting(selectedElement.state.getLabel()); 
        				selectedElement.toggleDoubleStroke();
        				console.log(machine.getLabels()); 

        			}
        		}
        	}; 
        	
        	
        	// Toggle start status of machine state
        	// ------------------------------------
        	
        	this.toggleStart = function(event){
        		if(selectedElement != null){
        			if(selectedElement instanceof Diagram.Vertex){
        				
        				// there are three cases; 
        				// first where there is no start vertex 
        				// 
        				
        				if(startVertex == null){
        					machine.setInitialStateByLabel(selectedElement.state.getLabel()); 
            				startVertex = selectedElement; 
            				startVertex.setStartIndicator(true); 
            				
        				} else if(startVertex == selectedElement){
        					selectedElement.setStartIndicator(false); 
        					machine.setInitialStateByLabel(null); 
            				startVertex = null; 
        					
        				} else if(startVertex != selectedElement){
        					startVertex.setStartIndicator(false);
        					machine.setInitialStateByLabel(selectedElement.state.getLabel()); 
            				startVertex = selectedElement; 
            				startVertex.setStartIndicator(true); 
        					
        				}

        		        $("#machine-pane").text(machine.characterDisplay());    
        			}
        		}
        	};
        	
        	// Edit an element in the Diagram 
        	// ------------------------------
        	
        	this.editElement = function(event){ 
        		
        		console.log("hi");
        		if(selectedElement == null){
        			return; 
        		}
        		
        		if(selectedElement instanceof Diagram.TransitionArc == false){ 
        			return;
        		}
        		
        		var transitionDescription = window.prompt("Set Transition", "0:0");
        		
        		var splitDescription = transitionDescription.split(":"); 
        		
        		
        		//some validation
        		
        		if(splitDescription.length != 2){
        			return; 
        		}
        		
        		if(splitDescription[0].length != 1 || machine.alphabet.contains(splitDescription[0]) == false){
        			return; 
        			
        		}

        		if(splitDescription[1].length != 1 || ( splitDescription[1] != "R" && splitDescription[1] != "L" && machine.alphabet.contains(splitDescription[1]) == false) ){
        			return; 
        		}
        		
        		// first delete the current transition with which the transition arc is 
        		// associated
        		
        		
        		var condition = selectedElement.condition;
        		var commandLabel = machine.getTransitionCommandLabelByCondition(condition); 
        		
        		
        		var conditionLabel = condition.state.label; 
        		var conditionCharacter = splitDescription[0]; 
        		
        		var commandType = null; 
        		var commandParameter = null; 
        		
        		if(machine.alphabet.contains(splitDescription[1]) == true){
        			commandType = TMCommand.WRITE; 
        			commandParameter = splitDescription[1]; 
        		} else if(splitDescription[1] == "L"){
        			commandType = TMCommand.MOVE_LEFT; 
        		} else if(splitDescription[1] == "R"){
        			commandType = TMCommand.MOVE_RIGHT; 
        		}
        		
        		console.log(commandType); 
        		machine.removeTransitionByCondition(condition); 
        		var newCondition = machine.addTransition(conditionLabel, conditionCharacter, commandLabel, commandType, commandParameter);
     
        		selectedElement.condition = newCondition; 
        		
        		selectedElement.arcLabel.updateText(transitionDescription); 
        		
        		
        		console.log(machine.getTransitionDescriptions());
        		
        		
        	};
        	
        	// Edit the machine tape  
        	// ------------------------------
        	
        	this.editTape = function(event){ 
        		var tape = window.prompt("Set Tape Contents"); 
        		 machine.setTapeContents(tape); 
        		 
        		 $("#machine-pane").text(machine.characterDisplay());    
        		
        	};
        	
        	
        	// Steps the machine  
        	// ------------------------------
        	
        	this.stepMachine = function(event){ 
        		machine.step(); 
        		$("#machine-pane").text(machine.characterDisplay());    
        		
        	};
        	
        	
        	
    		
    	}, 
    	
        el: $("#machine-pane"),
        render: function() {
    			
	        $("#machine-pane").text(this.machine.characterDisplay());    
    		
	       /* var layer =  new Kinetic.Layer(); 
    		
    		var vertex = new Diagram.Vertex({id:"vertex", doubleStroke: true,
    			x: 350, y:50, label:"Z"});
    		
    		var vertexy = new Diagram.Vertex({id:"vertexy", doubleStroke: false, 
    			x: 450, y:150, label:"Y"}); 

    		layer.add(vertex.getGroup()); 
    		
    		var layer2 = new Kinetic.Layer();
    		layer2.add(vertexy.getElement()); 
    		
    		var layer3 = new Kinetic.Layer();
    		
    		var ta = new Diagram.TransitionArc({
    			id: "ztoy1", 
    			label: "->", 
    			start: vertex.controlPoints[3],
    			end: vertexy.controlPoints[3]
    			                                            			
    		});
    		
    		layer3.add(ta.getElement());
    		
    		this.stage.add(layer); 
    		this.stage.add(layer2);
    		this.stage.add(layer3); 
    		

    		layer3.moveToBottom(); 
    		
    		this.stage.draw(); 
    		
	        var circle = this.stage.find("#vertex-innercircle")[0]; 
	        
	        this.stage.draw(); */
	        
    	} 
    	

    
    
    });
    // Our module now returns our view
    return DiagramView;
});
