'use strict'; 

/**
 * Alphabet model class. Used to define the Alphabet (i.e. the signature)
 * for a Turing Machine. By the default the Alphabet string is a 
 * binary alphabet (0,1) with 0 as the blank character. 
 *
 * Author: Paul Daniell <paul.d@mm.st>
 **/
define(["jquery", "underscore", "backbone", "utils/hashset"], 
function($, _, Backbone, Hashset){

    var Alphabet = Backbone.Model.extend({

        defaults: {
            blank:"0", 
            alphabet: "01"
        }, 

        initialize:function(attributes, options){
            this.blank = this.attributes.blank; 
            if(this.blank.length != 1){
               throw "Blank character must have length 1.";            
            }
            this.setAlphabet(this.attributes.alphabet); 
        },

        getBlank: function(){
            return this.blank; 
        },
        
        setBlank: function(blank){ 
            this.blank = blank; 
        },

        getAlphabet: function(){ 
            return this.alphabet;
        }, 

        setAlphabet: function(alphabet) { 
            this.alphabet = alphabet; 
            this.alphabetSet =  new Hashset(); 


            this.alphabetSet.add(this.blank); 
            for(var i = 0; i < alphabet.length; i++){
               var character = alphabet.charAt(i);
               this.alphabetSet.add(character) ;
            }

        },

        isCompatibleWith: function(s){
            for (var i = 0; i < s.length; i++){
                if(this.contains(s.charAt(i)) == false){    
                    return false;                
                }
            }
            return true;

        },

        contains: function(letter){ 
            if(this.alphabetSet.contains(letter)){
                return true; 
            }
            return false; 
        }

    }); 
    
    Alphabet.DEFAULT_BINARY = new Alphabet({blank:"0", alphabet:"01"});
     
    return Alphabet; 

});
