import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Nfts } from '../nfts.js';
import { Transactions } from '/imports/api/transactions/transactions.js';

Meteor.methods({
    'nfts.getNfts': function() {
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
            let trades = Transactions.find({
                $or: [
                    {"tx.body.messages.@type":"/Pylonstech.pylons.pylons.MsgCreateTrade"}
                ]
            }).fetch().map((p) => p.tx.body.messages[0]);

            if(trades == null || trades.length == 0){
                return false;
            }
   
            let finishedNftIds = new Set(Nfts.find({ }).fetch().map((p) => p.ID)); 
            let activeNfts = new Set(Nfts.find({ "Tradable": { $in: [true] } }).fetch().map((p) => p.ID));

            let nftIds = [];
            
            if (trades.length > 0) {

                const bulkNfts = Nfts.rawCollection().initializeUnorderedBulkOp();
                for (let i in trades) {
                    let trade = trades[i];
                    nftIds.push(trade.itemOutputs[0].itemID);
                    
                    if (finishedNftIds.NO != -1 && !finishedNftIds.has(trade.itemOutputs[0].itemID)) {
                        try { 
                            let response = HTTP.get("http://api.testnet.pylons.tech:1317/pylons/executions/item/" + trade.itemOutputs[0].cookbookID + '/' +  trade.itemOutputs[0].itemID);
                            let executions = JSON.parse(response.content);
                            let item = executions.CompletedExecutions[0]
                            // let response = HTTP.get("https://api.testnet.pylons.tech/pylons/item/cookbook_for_test5/LQM2cdzDY3");
                            // let executions = JSON.parse(response.content);
                            // let item = executions.Item                            
                            if(item == undefined || item == null || item.length == 0){
                                continue
                            }
                            let date = new Date();
                            item.NO = date.getFullYear() * 1000 * 360 * 24 * 30 * 12 + date.getMonth() * 1000 * 360 * 24 * 30 + date.getDay() * 1000 * 360 * 24 + date.getHours() * 1000 * 360 + date.getMinutes() * 1000 * 60 + date.getSeconds() * 1000 + date.getMilliseconds();
                            item.tradeable = true;
                            
                            let resalelink = 'https://wallet.pylons.tech?action=resell_nft&recipe_id=' + item.recipeID + '&cookbook_id='+ nft.cookbookID + '&nft_amount=1';   
                            item.resalelink = resalelink; 
 
                            bulkNfts.find({ ID: item.ID }).upsert().updateOne({ $set: item });

                        } catch (e) {
                            //bulkNfts.find({ ID: trade.itemOutputs[0].itemID }).upsert().updateOne({ $set: nft });
                        }
                    }
                }
 
                bulkNfts.find({ ID: { $nin: nftIds }, tradeable: { $nin: [true, false] } })
                    .update({ $set: { tradeable: true } });
                bulkNfts.execute();
            }
            return true
        } catch (e) { 
            console.log(e);
        }
    },
    'nfts.getNftResults': function() {
        this.unblock();
        let nfts = Nfts.find({ "tradeable" : { $nin: [true, false] } }).fetch(); 
        if (nfts && (nfts.length > 0)) {
            for (let i in nfts) {
                if (nfts[i].ID != -1) {
                    let url = "";
                    try {
                        let nft = { ID: nfts[i].ID };

                        //recipe.updatedAt = new Date();
                        Nfts.update({ ID: nfts[i].ID }, { $set: nft });
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