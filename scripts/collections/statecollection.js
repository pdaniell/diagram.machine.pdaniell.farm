define(["jquery", "underscore", "backbone", "backboneLocalStorage","models/state"], 
function($, _, Backbone, Store, State){
     var StateCollection = Backbone.Collection.extend({
        name: null, localStorage: null, model: State,
        initialize: function(models, options){
            this.name = options.name; 
            this.localStorage = new Store(options.name); 
        }

      });
      // You don't usually return a collection instantiated
      return StateCollection;

}); 