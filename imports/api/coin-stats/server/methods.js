import { Meteor } from 'meteor/meteor';
import { CoinStats } from '../coin-stats.js';
import { HTTP } from 'meteor/http';
import { string } from 'prop-types';

Meteor.methods({
    'coinStats.getCoinStats': function(){
        this.unblock();
        let coinId = Meteor.settings.public.coingeckoId;
        if (coinId){
            try{
                let now = new Date();
                now.setMinutes(0);
                let url = API + '/custom/pylons/items_by_sender/';
                if(Meteor.settings.public.cosmos_sdk == 44){
                    url = API + '/pylons/items/';  
                } 
                let response = HTTP.get(url);  
                if (response.statusCode == 200){ 
                    let items = JSON.parse(response.content).Items;
                    let strings = items.Strings;
                    let price = 0.0, currency = "USD";
                    for (i = 0; i < strings.length; i++) {
                        if(strings.Key == "Currency"){
                            currency = strings.Value;
                        }
                        else if(strings.Key == "Price"){
                            price = strings.Value;
                        }
                    }
                    if(currency == "pylon"){
                        price = price * 100;
                    }
                    else{
                        price = price / 100;
                    }
                    data = data[coinId];
                    // console.log(coinStats);
                    return CoinStats.upsert({last_updated_at:data.last_updated_at}, {$set:data});
                }
            }
            catch(e){
                console.log(url);
                console.log(e);
            }
        }
        else{
            return "No coingecko Id provided."
        }
    },
    'coinStats.getStats': function(){
        this.unblock();
        let coinId = Meteor.settings.public.coingeckoId;
        if (coinId){
            return (CoinStats.findOne({},{sort:{last_updated_at:-1}}));
        }
        else{
            return "No coingecko Id provided.";
        }

    }
})