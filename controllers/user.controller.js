const { User } = require("../dataBase");
const { OAuth } = require("../dataBase");
const passwordService = require("../services/password.services");

module.exports = {
    getUserById: async (req, res, next) => {
        try {
            const userId = req.loggedUser._id.toString();
            console.log('userId', userId)
            let user = await User.findById(userId);
            

            return res.status(200).json({
                "user": {
                    "_id": user._id,
                    "role": user.role,
                    "email": user.email,
                    "created_date": user.createdAt
                }
            })
        } catch (e) {
            next(e);
        }
    },
    deleteUserById: async (req, res, next) => {
        try {
            const userId = req.loggedUser._id.toString();
            await User.findByIdAndDelete(userId);

            await OAuth.deleteOne({ "user": req.loggedUser._id });

            return res.status(200).json({ "message": "Profile deleted successfully" })
        } catch (e) {
            next(e);
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const userId = req.loggedUser._id.toString();

            const user = await User.findOne({ "_id": req.loggedUser._id })
            await passwordService.compare(req.body.oldPassword, user.password)
            const hashPassword = await passwordService.hash(req.body.newPassword);

            await User.findByIdAndUpdate(userId, { password: hashPassword });
            return res.status(200).json({ "message": "Password changed successfully" })

        } catch (e) {
            next(e);
        }
    }
};