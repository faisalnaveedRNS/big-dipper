import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Recipes } from '/imports/api/recipes/recipes.js'; 
import { Nfts } from '/imports/api/nfts/nfts.js';
import List from './List.jsx';

export default RecipesListContainer = withTracker((props) => {
    let recipesHandle, recipes, recipesExist;
    let loading = false;  

    if (Meteor.isClient) {
        recipesHandle = Meteor.subscribe('recipes.list');
        loading = !recipesHandle.ready();
        console.log('------isClient-----', loading);  
    }

    if (Meteor.isServer || !loading) {
        recipes = Recipes.find({}, { sort: { ID: -1 } }).fetch(); 
        if (Meteor.isServer) {
            loading = false;
            recipesExist = !!recipes;
        } else {
            recipesExist = !loading && !!recipes;
        }
        console.log('------isServer-----', recipesExist); 
        console.log('------isServer - loading-----', loading); 
    } 

    var nftLoading = false;
    var nftsExist = false;
    var nfts;
    if (Meteor.isClient) {
        let nftsHandle = Meteor.subscribe('nfts.list', 10);
        nftLoading = !nftsHandle.ready();

        if (!nftLoading) { 
            nfts = Nfts.find({}, { sort: { ID: -1 } }).fetch(); 
            nftsExist = !nftLoading && !!nfts;
        }
    } 
    if ((Meteor.isServer || !nftLoading)) { 
        nfts = Nfts.find({}, { sort: { ID: -1 } }).fetch(); 
        if (Meteor.isServer) {
            nftLoading = false;
            nftsExist = !!nfts;
        } else {
            nftsExist = !nftLoading && !!nfts;
        } 
    }  
 
    console.log('------nfts-----', nfts);    
    console.log('------recipes-----', recipes);
    console.log('------loading-----', loading);    
    console.log('------recipesExist-----', recipesExist);
    loading = false;

    return {
        loading,
        recipesExist,
        recipes: recipesExist ? recipes : {},
        history: props.history, 
        nfts: nfts,
    };
})(List);