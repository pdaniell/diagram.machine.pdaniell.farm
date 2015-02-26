'use strict';
/**
 * Constants class. 
 *
 * Author: Paul Daniell <paul.d@mm.st>
 *
 **/
 
define(["jquery", "underscore", "backbone"], 
function ($, _, Backbone) {
	var Constants = {
		// Which filter are we using?
		TodoFilter: '', // empty, active, completed

		// What is the enter key constant?
		ENTER_KEY: 13, 
		
		
		Events: {
			MOUSEOVER: 		"mouseover",
			MOUSEMOVE: 		"mousemove", 
			MOUSEOUT:		"mouseout",
			MOUSEENTER: 	"mouseenter",
			MOUSELEAVE: 	"mouseleave",
			MOUSEDOWN: 		"mousedown", 
			MOUSEUP: 		"mouseup",
			CLICK:			"click", 
			DOUBLECLICK: 	"dblclick", 
			TOUCHSTART:		"touchstart", 
			TOUCHMOVE: 		"touchmove", 
			TOUCHEND:		"touchend", 
			TAP:			"tap", 
			DOUBLETAP:		"dbltap", 
			DRAGSTART:		"dragstart", 
			DRAGMOVE:		"dragmove", 
			DRAGEND:		"dragend"
			
		}
		
	};

	String.prototype.endsWith = function(suffix) {
	    return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};			
	
	return Constants; 
});
