import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Chain } from '/imports/api/chain/chain.js';
import { Recipes } from '/imports/api/recipes/recipes.js';
import EaselBuy from './EaselBuy.jsx';
import { string } from 'prop-types';

export default HomeContainer = withTracker((props) => {
    let recipesHandle;
    let validatorsHandle;
    let loading = true;
    var name = '';
    var description = '';
    var img = '';
    var url = props.url;
    var price = '0 Pylon';
    var selectedRecipe = null;
    recipe_id = props.recipe_id

    if (Meteor.isClient) {
        recipesHandle = Meteor.subscribe('recipes.list', recipe_id);
        loading = !recipesHandle.ready();
    }

    let status; 

    if (Meteor.isServer || !loading) { 
        selectedRecipe = Recipes.findOne({ ID: recipe_id });
    }
    else{
        selectedRecipe = Recipes.findOne({ ID: recipe_id });
    }   
 
    if (selectedRecipe != null) {
        name = selectedRecipe.name
        description = selectedRecipe.description;
        // if (description.length > 15) {
        //     description = description.substring(0, 12) + '...';
        // }
        const coinInputs = selectedRecipe.coinInputs;
        if (coinInputs.length > 0) {
            if(coinInputs[0].coins[0].denom == "USD"){
                price = Math.floor(coinInputs[0].coins[0].amount / 100) + '.' + (coinInputs[0].coins[0].amount % 100) + ' ' + coinInputs[0].coins[0].denom;
            }
            else{
                price = coinInputs[0].coins[0].amount + ' ' + coinInputs[0].coins[0].denom
            }
        }
        const entries = selectedRecipe.entries;
        if (entries != null) {
            const itemoutputs = entries.itemOutputs; 
            if (itemoutputs.length > 0) {
                let strings = itemoutputs[0].strings
                for (i = 0; i < strings.length; i++) {
                    try {
                        var values = strings[i].value;
                        if (values.indexOf('http') >= 0 && (values.indexOf('.png') > 0 || values.indexOf('.jpg') > 0)) {
                            img = values;   
                            break;
                        }
                    } catch (e) {
                        console.log('strings[i].Value', e)
                        break;
                    }

                }
            } 
        }
    }
 
    return {
        name,
        description,
        price,
        img: img,
        url: url,
    };
})(EaselBuy);