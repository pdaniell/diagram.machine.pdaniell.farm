'use strict';
/** 
 * DFA Command. These are elements of the domain of the 
 * transition function. 
 * 
 * @author: Paul Daniell <paul.d@mm.st>
 * 
 */

define(["jquery", "underscore", "backbone", "models/state" ], 
function($, _, Backbone, State){

   var DFACommand = Backbone.Model.extend({
  
        defaults: {
            state: null
        },

        initialize:function(attributes, options){
            if(this.attributes.state instanceof State == false){
                throw "Invalid state.";             
            }

            this.state = this.attributes.state; 
        },

        getState: function(){ 
            return this.state; 
        }, 


        setState: function(state){ 

            if(state instanceof State == false){
                throw "Invalid state.";             
            }


            this.state = state; 
        }

    }); 

    return DFACommand; 
}); 
