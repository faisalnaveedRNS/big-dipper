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
            let items = Transactions.find({
                $or: [
                    {"tx.body.messages.@type":"/Pylonstech.pylons.pylons.QueryListItemByOwner"}
                ]
            }).fetch();

            if(items == null || items.length == 0){
                return false;
            }

            let nfts = items.Items;
            let finishedNftIds = new Set(Nfts.find({ "Tradable": { $in: [true, false] } }).fetch().map((p) => p.ID)); 
            let activeNfts = new Set(Nfts.find({ "Tradable": { $in: [true] } }).fetch().map((p) => p.ID));

            let nftIds = [];
            if (nfts.length > 0) {

                const bulkNfts = Nfts.rawCollection().initializeUnorderedBulkOp();
                for (let i in nfts) {
                    let nft = nfts[i];
                    nftIds.push(nft.ID);
                    if (nft.NO != -1 && !finishedNftIds.has(nft.ID)) {
                        try {
                            let date = new Date();
                            nft.NO = date.getFullYear() * 1000 * 360 * 24 * 30 * 12 + date.getMonth() * 1000 * 360 * 24 * 30 + date.getDay() * 1000 * 360 * 24 + date.getHours() * 1000 * 360 + date.getMinutes() * 1000 * 60 + date.getSeconds() * 1000 + date.getMilliseconds();
 
 
                            nft.nftId = nft.NO;
                            let resalelink = 'https://wallet.pylons.tech?action=resell_nft&recipe_id=' + nft.ID + '&nft_amount=1';   
                            nft.resalelink = resalelink; 
 
                            bulkNfts.find({ ID: nft.ID }).upsert().updateOne({ $set: nft });

                        } catch (e) {
                            bulkNfts.find({ ID: nft.ID }).upsert().updateOne({ $set: nft });
                        }
                    }
                }

                bulkNfts.find({ ID: { $nin: nftIds }, Tradable: { $nin: [true, false] } })
                    .update({ $set: { Tradable: false } });
                bulkNfts.execute();
            }
            return true
        } catch (e) {
            console.log(url);
            console.log(e);
        }
    },
    'nfts.getNftResults': function() {
        this.unblock();
        let nfts = Nfts.find({ "Tradable": { $nin: [true, false] } }).fetch();
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