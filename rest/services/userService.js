const { find } = require('../models/userModel');
const userSchema = require('../models/userModel')

const userService = {
    async getUserByName(name) {
        try{
            const user = await userSchema.findOne({name:name});
            return{   status: 'Success', code: 200, message: 'User with name ' + name + ' is found', data: user}

        }catch(e){
            return{status: 'Failed', code: 400,message: e.message, data: {}}
        }
    },
    async getUserAuctions(name){
        try {
            const user = await userSchema.findOne({name:name}).populate(
                {
                    path:"auctions"
                }
            )
            if(user.auctions.length>0){
                return{   status: 'Success', code: 200, message: 'Auctions found for user with name ' + name, data: user.auctions}
            }else{
                return{   status: 'Failed', code: 200, message: 'User with name: ' + name + ' is not participating in auctions', data: []}
            }
        } catch (e) {
            return{status: 'Failed', code: 400, message: e.message, data: []}
        }
    },

    async logIn(name){
        try {
            if (await userSchema.exists({name:name})){
                const user = await userSchema.findOne({name:name});
                return{   status: 'Success', code: 200, message: 'Data of the user ' + name , data: user };
            }
            else{
                const userStructure = {name:name, role:"user", auctions:[]};
                const user = userSchema(userStructure);
                await user.save();
                return{   status: 'Success', code: 200, message: 'Data of the NEW user ' + name , data: userStructure };
            }
        } catch (e) {
            return{status: 'Failed', code: 400, message: e.message, data: []}
        }
    },
};

module.exports = userService;