const { postService } = require('../services/userService');
const userService = require('../services/userService');


const userController = {
    async getUserByName(req, res) {
        const name = req.params.name;
        await userService
            .getUserByName(name)
            .then((result) => {
                res.status(result.code).json(result);
            })
            .catch((err) => {
                res.status(err.code).json(err);
            });
    },
    async getUserAuctions(req,res){
        const name = req.params.name;
        await userService.getUserAuctions(name)
            .then((result) => {
                res.status(result.code).json(result);
            })
            .catch((err) => {
                res.status(err.code).json(err);
            });
    },

    async logIn(req,res){
        const name = req.body.name;
        await userService.logIn(name)
            .then((result) => {
                res.status(result.code).json(result);
            })
            .catch((err) => {
                res.status(err.code).json(err);
            });
    }
};

module.exports = userController;