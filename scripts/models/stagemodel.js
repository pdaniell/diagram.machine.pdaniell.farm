'use strict'; 

/** 
 * Stage Model class. This is a base class for model classes
 * that require geometry coordinate properties. 
 *
 * Author: Paul Daniell <paul.d@mm.st>
 * 
 **/

define(["jquery", "underscore", "backbone"], 
function($, _, Backbone){
    var StageModel = Backbone.Model.extend({
      
        defaults: {
            x: 0, 
            y: 0, 
            w: 0, 
            h: 0, 
            isVisible: true
        },

        initialize: function(attributes, options){
            this.x = this.attributes.x;
            this.y = this.attributes.y;
            this.w = this.attributes.w;
            this.h = this.attributes.h;
            this.isVisible = this.attributes.isVisible;
        }, 

        getX: function(){ 
            return this.x;
        },

        getY: function(){ 
            return this.y; 
        }, 

        getWidth: function(){ 
            return this.width;
        }, 

        getHeight: function() { 
            return this.height; 
        }, 

        getVisibility: function() {
            return this.isVisible; 
        },


        setX: function(x){ 
            this.x = x; 
        },

        setY: function(y){ 
            this.y = y; 
        }, 

        setWidth: function(width){ 
            this.width = width;
        }, 

        setHeight: function(height) { 
            this.height = height; 
        }, 

        setVisibility: function(isVisible) {
            this.isVisible = isVisiible; 
        }

        
    });
    
    return StageModel; 
});