'use strict';

/** 
 * main.js -- Main entry point for the application. 
 * Configures dependencies and starts the router class. 
 * 
 * Author: Paul Daniell <paul.d@mm.st>
 * 
 **/


require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
		backboneLocalstorage: {
			deps: ['backbone'],
			exports: 'Store'
		}


    },

    paths: {
        jquery: "lib/jquery-1.10.2.min",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        kinetic: "lib/kinetic-v4.7.4",
		backboneLocalstorage: 'lib/backbone.localStorage',
        text: 'lib/text'
    }

});


require(["router"], function(Router) {
    var router = new Router();
});



