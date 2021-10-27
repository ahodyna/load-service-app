const { OAuth } = require("../dataBase");
const { passwordService, jwtService } = require("../services");
const { User } = require("../dataBase");
const ErrorHandler = require("../errors/ErrorHandler");

module.exports = {
    login: async (req, res, next) => {
        try {
            const body = req.body;

            const user = await User.findOne({ "email": body.email });
         
            if (user === null || user === undefined) {
                throw new ErrorHandler(400, "User cannot exists");
            }

            await passwordService.compare(body.password, user.password);

            const tokenPair = jwtService.generateTokenPair();

            await OAuth.create({ ...tokenPair, user: user._id });

            return res.status(200).json({ "jwt_token": tokenPair.access_token })

        } catch (e) {
            next(e);
        }
    },
    register: async (req, res, next) => {
        try {

            const { email } = req.body;

            let user = await User.findOne({ "email": email });
            if (user) {
                throw new ErrorHandler(400, "User already exists");
            }

            await User.createWithHashPassword(req.body);
            return res.status(200).json({ "message": "Success" })
        } catch (e) {
            next(e);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {

        } catch (e) {
            next(e)
        }
    },

}