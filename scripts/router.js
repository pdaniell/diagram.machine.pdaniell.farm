'use strict'; 

/** 
 * AppRouter class. Routes actions to views. 
 *
 * Author: Paul Daniell <paul.d@mm.st>
 *
 **/

define(['jquery', 'underscore', 'backbone', 'views/appview' ],
function($, _, Backbone, AppView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Default
            "*action": 'defaultAction'
        },


        initialize: function() {
            this.on('route:defaultAction', function(action) {
                var view = new AppView();
                view.render();
            });
            Backbone.history.start();
        }

    });


    return AppRouter;
});
