const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    auctions:
        [
            {
                type: String,
                required: true
            }
        ],
},{
    versionKey:false
});

module.exports = mongoose.model('User', userSchema)