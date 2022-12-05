const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    item: {
        type: String,
        required: true,
        unique: true
    },
    finished: {
        type: Boolean,
        required: true,
        default: false
    },
    bestOffer: {
        type: Number,
        required: true
    },
    bestOfferor: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    participants:
        [
            {
                type: String,
                required: true
            }
        ],
    log:
        [
            {
                type: String,
                required: true
            }
        ],
},{
    versionKey:false
});

module.exports = mongoose.model('Auction', auctionSchema);