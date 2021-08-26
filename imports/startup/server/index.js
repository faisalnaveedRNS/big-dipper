// Import server startup through a single index entry point

import './util.js';
import './register-api.js';
import './create-indexes.js';
import queryString from 'querystring'; 
import { HTTP } from 'meteor/http';
import { onPageLoad } from 'meteor/server-render'; 
import { Meteor } from 'meteor/meteor';  
 
// import { ServerStyleSheet } from "styled-components"
import { Helmet } from 'react-helmet'; 
// import App from '../../ui/App.jsx';

var siteName = 'Big-Dipper';
var description = 'Wallet deep link';
var price = "No Price"
var picWidth = 1200;
var picHeight = 800;
const defaultImage = '/img/buy_icon.png'; 
const defaultMetaTags = `
<meta property="og:title"       content="${siteName}" />
<meta property="og:description" content="${description}" />
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
                
                if(selectedRecipe.Name != undefined && selectedRecipe.Name != ""){
                    siteName = selectedRecipe.Name; 
                }

                if(selectedRecipe.Description != undefined && selectedRecipe.Description != ""){ 
                    description = selectedRecipe.Description;
                    if (description.length > 20) {
                        description = description.substring(0, 20) + '...';
                    }
                }

                const coinInputs = selectedRecipe.CoinInputs; 
                if (coinInputs.length > 0) {
                    if(coinInputs[0].Coin == "USD"){
                        price = Math.floor(coinInputs[0].Count / 100) + '.' + (coinInputs[0].Count % 100) + ' ' + coinInputs[0].Coin;
                    }
                    else{
                        price = coinInputs[0].Count + ' ' + coinInputs[0].Coin
                    }
                }
                
                //description = description + "\n\n" + price;
                if (entries != null) {
                    const itemoutputs = entries.ItemOutputs; 
                    if (itemoutputs.length > 0) {
                        let strings = itemoutputs[0].Strings;
                        var img_rat = 0.7;
                        for (i = 0; i < strings.length; i++) { 
                            if(strings[i].Key == "Img_Rat"){
                                if(strings[i].Value != undefined && strings[i].Value != ""){
                                    img_rat = strings[i].Value; 
                                }
                               
                            }
                        }

                        for (i = 0; i < strings.length; i++) {
                            try {
                                var values = strings[i].Value;
                                if (values.indexOf('http') >= 0 && (values.indexOf('.png') > 0 || values.indexOf('.jpg') > 0)) {
                                    img = values;  
                                    // var refImg = new Image();
                                    // refImg.src = values;   
                                    // picWidth = refImg.width;
                                    // picHeight = refImg.height
                                    picHeight = picWidth * img_rat;   
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
                <meta property="og:type"              content="article">
                <meta property="og:title"             content="${siteName}" />
                <meta property="og:description"       content="${description}" data-rh="true"/>
                <meta property="og:url"               content="${Meteor.absoluteUrl() + url}" />
                <meta property="og:image"             content="${img}" />
                <meta property="og:image:width"       content="${picWidth}" />
                <meta property="og:image:height"      content="${picHeight}" />
                <meta name="twitter:card"             content="summary_large_image" />
                <meta name="twitter:label1"           content="${price}" />
                <meta name="twitter:data1"            content="">
                <meta name="twitter:label2"           content="Price" />
                <meta name="twitter:data2"            content="${price}">
                <meta property="article:published_time" content="2020-06-26T10:49:47+00:00">
                `;


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