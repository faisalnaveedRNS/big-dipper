import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Recipes } from '../recipes.js';

Meteor.methods({
    'recipes.getRecipes': function() {
        this.unblock();

        let url = API + '/custom/pylons/list_recipe/';
        try {
            let response = HTTP.get(url);

            let recipes = JSON.parse(response.content).recipes; 
            return recipes
        } catch (e) {
            console.log(url);
            console.log(e);
        }
    } 
})