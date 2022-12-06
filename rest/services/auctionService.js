const { find } = require('../models/auctionModel');
const auctionSchema = require('../models/auctionModel')

const auctionService = {
    async getAuctions(){
        try{
            const auctions = await auctionSchema.find()
            if(auctions.length>0){
                return{   status: 'Success', code: 200, message: 'Auctions found', data: auctions}
            }else{
                return{   status: 'Failed', code: 400, message: 'Auctions not found', data: []}
            }
        }catch(e){
            return{status: 'Failed', code: 400,message: e.message, data: []}
        }
    },
    async getAuctionByItem(item) {
        try{
            const auction = await auctionSchema.findOne({item:item});
            return{   status: 'Success', code: 200, message: 'Auction with item ' + item + ' is found', data: auction}

        }catch(e){
            return{status: 'Failed', code: 400,message: e.message, data: {}}
        }
    },
    async getAuctionParticipants(item){
        try {
            const auction = await auctionSchema.findOne({item:item}).populate(
                {
                    path:"participants"
                }
            )
            if(auction.participants.length>0){
                return{   status: 'Success', code: 200,message: 'Participants were found for the auction with item' + item, data: auction.participants}
            }else{
                return{   status: 'Failed', code: 200,message: 'Auction with item:' + item + ' does not have participants', data: []}
            }
        } catch (e) {
            return{status: 'Failed', code: 400, message: e.message, data: []}
        }
    },
    async getAuctionLog(item){
        try {
            const auction = await auctionSchema.findOne({item:item}).populate(
                {
                    path:"log"
                }
            )
            if(auction.log.length>0){
                return{   status: 'Success', code: 200,message: 'Logs were found for the auction with item' + item, data: auction.log}
            }else{
                return{   status: 'Failed', code: 200,message: 'Auction with item:' + item + ' does not have logs', data: []}
            }
        } catch (e) {
            return{status: 'Failed', code: 400, message: e.message, data: []}
        }
    }
};

module.exports = auctionService;