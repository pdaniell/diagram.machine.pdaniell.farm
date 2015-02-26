'use strict'; 

/**
 * AppView class. Main view class. 
 * 
 * @author Paul Daniell <paul.d@mm.st>
 * 
 **/

define(["jquery", "underscore", "backbone", "views/diagramview", 
        "models/alphabet", "models/tm/turingmachine", 
        "models/tm/tmcommand", "models/tape"],
function($, _, Backbone, DiagramView, Alphabet, TuringMachine, TMCommand, Tape) {

    var AppView = Backbone.View.extend({

        initialize:function(){ 
			
    		// Create a new Turing Machine
    		var alphabet = new Alphabet({blank:"0", alphabet:"01"}); 
			var tm = new TuringMachine({alphabet: alphabet, initialPosition:0}); 
			
			tm.setTape(new Tape({chars:"000001111"})); 
			
			// Create a Diagram View
			
            var diagramView = new DiagramView({machine:tm});
            diagramView.render(); 
            
            //Create Machine View
            //var machineView = new MachineView({machine:tm}); 
            
            // Now bind a events
            $("#add-button").on("click", diagramView.addNewState); 
            $("#delete").on("click", diagramView.deleteSelectedElement); 
            $("#accept").on("click", diagramView.toggleAcceptingState); 
            $("#start").on("click", diagramView.toggleStart);
            $("#edit").on("click", diagramView.editElement);      
            $("#tape").on("click", diagramView.editTape);      
            $("#step").on("click", diagramView.stepMachine);              
        }


    });     

    return AppView; 

});
