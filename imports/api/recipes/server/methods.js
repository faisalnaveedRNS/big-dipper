import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Recipes } from '../recipes.js';
import { Transactions } from '/imports/api/transactions/transactions.js';
import { Cookbooks } from '/imports/api/cookbooks/cookbooks.js'; 
import { image } from 'd3-fetch';

Meteor.methods({
    'recipes.getRecipes': function() {
        this.unblock();

        let transactionsHandle, transactions, transactionsExist;
        let loading = true;
        
        try { 
            if (Meteor.isClient){
                transactionsHandle = Meteor.subscribe('transactions.validator', props.validator, props.delegator, props.limit);
                loading = !transactionsHandle.ready();
            }
        
            if (Meteor.isServer || !loading){
                transactions = Transactions.find({}, {sort:{height:-1}});
        
                if (Meteor.isServer){
                    loading = false;
                    transactionsExist = !!transactions;
                }
                else{
                    transactionsExist = !loading && !!transactions;
                }
            }

            if(!transactionsExist){
                return false;
            }
            let recipes = Transactions.find({
                $or: [
                    {"tx.body.messages.@type":"/Pylonstech.pylons.pylons.MsgCreateRecipe"}
                ]
            }).fetch().map((p) => p.tx.body.messages[0]);; 

            if(recipes == null || recipes.length == 0){
                return false;
            }  

            let finishedRecipeIds = new Set(Recipes.find({ "enabled": { $in: [true, false] } }).fetch().map((p) => p.ID));


            let activeRecipes = new Set(Recipes.find({ "enabled": { $in: [true] } }).fetch().map((p) => p.ID));

            let recipeIds = [];
            if (recipes.length > 0) {
                 
                const bulkRecipes = Recipes.rawCollection().initializeUnorderedBulkOp(); 

                for (let i in recipes) {
                    let recipe = recipes[i];
                    let deeplink = 'https://wallet.pylons.tech?action=purchase_nft&recipe_id=' + recipe.ID /*+ "&cookbook_id=" + recipe.cookbookID */+  '&nft_amount=1';  
                    recipe.deeplink = deeplink;
                    var cookbook_owner = "", creator = "";
                    if (transactionsExist){  
                        try { 
                            let cookbooks = Cookbooks.find({ID: recipe.cookbookID}).fetch() 
                            if (cookbooks.length > 0) {
                                cookbook_owner = recipe.ID;
                                creator = cookbooks[0].creator;
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } 
                    recipe.cookbook_owner = cookbook_owner;
                    recipe.creator = creator;
                    recipeIds.push(recipe.ID);
                    if (recipe.NO != -1 && !finishedRecipeIds.has(recipe.ID)) {
                        try {
                            let date = new Date();
                            recipe.NO = date.getFullYear() * 1000 * 360 * 24 * 30 * 12 + date.getMonth() * 1000 * 360 * 24 * 30 + date.getDay() * 1000 * 360 * 24 + date.getHours() * 1000 * 360 + date.getMinutes() * 1000 * 60 + date.getSeconds() * 1000 + date.getMilliseconds();
                            recipe.recipeId = recipe.NO;
                            if (activeRecipes.has(recipe.ID)) {
                                let validators = []
                                let page = 0;

                                // do {
                                //     url = RPC + `/validators?page=${++page}&per_page=100`;
                                //     let response = HTTP.get(url);
                                //     result = JSON.parse(response.content).result;
                                //     validators = [...validators, ...result.validators];

                                // }
                                // while (validators.length < parseInt(result.total))

                                // let activeVotingPower = 0;
                                // for (v in validators) {
                                //     activeVotingPower += parseInt(validators[v].voting_power);
                                // }
                                // recipe.activeVotingPower = activeVotingPower;

                            }
                            //Recipes.insert(recipe);
                            bulkRecipes.find({ ID: recipe.ID }).upsert().updateOne({ $set: recipe });

                        } catch (e) {
                            bulkRecipes.find({ ID: recipe.ID }).upsert().updateOne({ $set: recipe });
                        }
                    }
                }

                bulkRecipes.find({ ID: { $nin: recipeIds }, enabled: { $nin: [true, false] } })
                    .update({ $set: { enabled: true } });
                bulkRecipes.execute();
            }
            return recipes
        } catch (e) { 
            console.log(e);
        }
    },
    'recipes.getRecipeResults': function() {
        this.unblock();
        let recipes = Recipes.find({ "enabled": { $nin: [true, false] } }).fetch();
        if (recipes && (recipes.length > 0)) {
            for (let i in recipes) {
                if (recipes[i].ID != -1) {
                    let url = "";
                    try {
                        let recipe = { ID: recipes[i].ID };

                        //recipe.updatedAt = new Date();
                        Recipes.update({ ID: recipes[i].ID }, { $set: recipe });
                    } catch (e) {
                        console.log(url);
                        console.log(e);
                    }
                }
            }
        }
        return true
    }
})