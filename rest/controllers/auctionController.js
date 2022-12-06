const { postService } = require('../services/auctionService');
const auctionService = require('../services/auctionService');


const auctionController = {
    async getAuctions(req, res) {
        await auctionService
            .getAuctions()
            .then((result) => {
                res.status(result.code).json(result);
            })
            .catch((err) => {
                res.status(err.code).json(err);
            });
    },
    async getAuctionByItem(req, res) {
        const item = req.params.item;
        await auctionService
            .getAuctionByItem(item)
            .then((result) => {
                res.status(result.code).json(result);
            })
            .catch((err) => {
                res.status(err.code).json(err);
            });
    },
    async getAuctionParticipants(req,res){
        const item = req.params.item;
        await auctionService.getAuctionParticipants(item)
            .then((result) => {
                res.status(result.code).json(result);
            })
            .catch((err) => {
                res.status(err.code).json(err);
            });
    },
    async getAuctionLog(req,res){
        const item = req.params.item;
        await auctionService.getAuctionLog(item)
            .then((result) => {
                res.status(result.code).json(result);
            })
            .catch((err) => {
                res.status(err.code).json(err);
            });
    }
};

module.exports = auctionController;