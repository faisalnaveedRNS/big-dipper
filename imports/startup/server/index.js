// Import server startup through a single index entry point

import './util.js';
import './register-api.js';
import './create-indexes.js';
import queryString from 'querystring'; 
import { HTTP } from 'meteor/http';
import { onPageLoad } from 'meteor/server-render'; 
import { Meteor } from 'meteor/meteor'; 
import { BrowserRouter as Router, StaticRouter} from 'react-router-dom'
// import { ServerStyleSheet } from "styled-components"
import { Helmet } from 'react-helmet'; 
// import App from '../../ui/App.jsx';
const siteName = 'Big-Dipper';
const defaultImage = '/img/buy_icon.png';
const defaultMetaTags = `
<meta property="og:title"       content="${siteName}" />
<meta property="og:description" content="Wallet deep link" />
<meta property="og:image"       content="${defaultImage}" />
<meta property="og:url"         content="https://api.testnet.pylons.tech" />
`;

async function  getRecipeData(recipe_id){
    selectedRecipe = await Recipes.findOne({ ID: recipe_id });
    return selectedRecipe
} 

Meteor.startup(() => { 
  
    onPageLoad(sink => {  
        let url = sink.request.url.search;     
        if(url == null){
            sink.appendToHead(defaultMetaTags); 
            return;
        }    
        const querys = queryString.parse(url); 
        var img = ''; 
        var selectedRecipe = null;
        var recipes = null; 
        if (querys['?action'] == "purchase_nft" && querys['recipe_id'] != null && querys['nft_amount'] == 1) { 
            const recipe_id = querys['recipe_id']   
            let getRecipesUrl ='https://api.testnet.pylons.tech/custom/pylons/list_recipe/';   
            try {
                let response = HTTP.get(getRecipesUrl); 
                recipes = JSON.parse(response.content).recipes;  
            } catch (e) {
                console.log(url);
                console.log(e);
            }
            
            if (recipes != null && recipes.length > 0) {   
                for (let i in recipes) {
                    selectedRecipe = recipes[i];
                    if(selectedRecipe.ID == recipe_id){
                        break;
                    }
                    selectedRecipe = null;
                }
            }
            
            if (selectedRecipe != undefined && selectedRecipe != null) {                 
                const entries = selectedRecipe.Entries;
                
                if (entries != null) {
                    const itemoutputs = entries.ItemOutputs; 
                    if (itemoutputs.length > 0) {
                        let strings = itemoutputs[0].Strings
                        for (i = 0; i < strings.length; i++) {
                            try {
                                var values = strings[i].Value;
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
                const MetaTags = `
                <meta property="og:title"       content="${siteName}" />
                <meta property="og:description" content="Wallet deep link" />
                <meta property="og:url"         content="${Meteor.absoluteUrl() + url}" />
                <meta property="og:image"       content="${img}" />`;
                sink.appendToHead(MetaTags);
            }
            
        } 
        else
        {
            sink.appendToHead(defaultMetaTags); 
        } 
        // sink.appendToHead(sheet.getStyleTags());
    });
});