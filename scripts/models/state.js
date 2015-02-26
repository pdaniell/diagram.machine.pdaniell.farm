'use strict'; 

/* 
 * State model class. Extends the stagemodel class. 
 * 
 * Author: Paul Daniell <paul.d@mm.st>
 * 
 */ 

define(["jquery", "underscore", "backbone", "models/stagemodel"], 
function($, _, Backbone, StageModel){

    var State = StageModel.extend({
  
        defaults: _.extend({}, StageModel.prototype.defaults, {
             label: null, 
             isAccepting: false            
        }),
       
        initialize: function(attributes, options){
        	State.__super__.initialize.call(this, attributes,options);
            this.label = this.attributes.label;
            this.isAccepting = this.attributes.isAccepting;
        },   

        getIsAccepting: function(){ 
            return this.isAccepting; 
        },

        setIsAccepting: function(isAccepting){
            this.isAccepting = isAccepting;         
        }, 

        getLabel: function(){ 
            return this.label; 
        }, 

        setLabel: function(label){
            this.label = label;         
        }
        

    });
    
    return State; 

});
