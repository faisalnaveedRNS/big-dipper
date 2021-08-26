import '/imports/startup/client';
import '/imports/ui/stylesheets/pace-theme.css';
import '/imports/ui/stylesheets/flipclock.css';
import '/node_modules/plottable/plottable.css';
import './styles.scss';
import App from '/imports/ui/App.jsx'; 
import { Recipes } from '/imports/api/recipes/recipes.js'; 
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';
import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import queryString from 'querystring';
// import { onPageLoad } from 'meteor/server-render';

CURRENTUSERADDR = 'ledgerUserAddress';
CURRENTUSERPUBKEY = 'ledgerUserPubKey';
BLELEDGERCONNECTION = 'ledgerBLEConnection'
ADDRESSINDEX = 'addressIndex'

const siteName = 'Big-Dipper';
const defaultImage = '/img/buy_icon.png';
const defaultMetaTags = `
<meta property="og:title"       content="${siteName}" />
<meta property="og:description" content="Wallet deep link" />
<meta property="og:image"       content="${defaultImage}" />`;

async function  getRecipeData(recipe_id){
    selectedRecipe = await Recipes.findOne({ ID: recipe_id });
    return selectedRecipe
} 

 

Meteor.startup(() => {
    //render(<Router><App /></Router>, document.getElementById('app'));
    // render(<Header />, document.getElementById('header'));


    onPageLoad(async sink => {
        const App = (await import('/imports/ui/App.jsx')).default;   
        ReactDOM.hydrate(
            <Router>
                <App />
            </Router>, document.getElementById('app')
        ); 
 
        // const querys = queryString.parse(this.location.search);
        // var name = '';
        // var description = '';
        // var img = '';
        // var url = '';
        // var price = '0 Pylon';
        // var selectedRecipe = null;
        // var loading;
        // if (querys['?action'] == "purchase_nft" && querys['recipe_id'] != null && querys['nft_amount'] == 1) { 
        //     const recipe_id = querys['recipe_id']  
        //     let url ='https://api.testnet.pylons.tech/custom/pylons/list_recipe/';  
        //     Meteor.call('recipes.getRecipes', (error, result) => {
        //         if (error) {
        //             console.log("get recipe: %o", error);
        //         }
        //         if (result.length > 0) {  
        //             selectedRecipe = result[0];  
        //             if (selectedRecipe != undefined && selectedRecipe != null) { 
        //                 name = selectedRecipe.Name 
        //                 description = selectedRecipe.Description; 
        //                 const coinInputs = selectedRecipe.CoinInputs;
        //                 if (coinInputs.length > 0) {
        //                     price = coinInputs[0].Count + ' ' + coinInputs[0].Coin
        //                 }
        //                 const entries = selectedRecipe.Entries;
        //                 if (entries != null) {
        //                     const itemoutputs = entries.ItemOutputs; 
        //                     if (itemoutputs.length > 0) {
        //                         let strings = itemoutputs[0].Strings
        //                         for (i = 0; i < strings.length; i++) {
        //                             try {
        //                                 var values = strings[i].Value;
        //                                 if (values.indexOf('http') >= 0 && (values.indexOf('.png') > 0 || values.indexOf('.jpg') > 0)) {
        //                                     img = values; 
        //                                     break;
        //                                 }
        //                             } catch (e) {
        //                                 console.log('strings[i].Value', e)
        //                                 break;
        //                             }
                
        //                         }
        //                     }
        //                     price = coinInputs[0].Count + ' ' + coinInputs[0].Coin 
        //                 }
        //                 const MetaTags = `
        //                 <meta property="og:title"       content="${siteName}" />
        //                 <meta property="og:description" content="Wallet deep link" />
        //                 <meta property="og:url"       content="${url}" />
        //                 <meta property="og:image"       content="${img}" />`;
        //                 sink.appendToHead(MetaTags); 
        //             }
        //             return result;
        //         }
                 
        //     }); 
            
        // } 
        // else{
        //     sink.appendToHead(defaultMetaTags);
        //     sink.appendToHead(createMetaTag('og:url', meteorHost));
        // }
        
    });
});
 