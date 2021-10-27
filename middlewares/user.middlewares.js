const ErrorHandler = require("../errors/ErrorHandler");
const userValidators = require('../validators/user.validator');

module.exports = {
    isShipper: async (req, res, next) => {
        try {
            let user = req.loggedUser;

            if (user.role !== "SHIPPER") {
                throw new ErrorHandler(400, "Forbidden");
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    isDriver: async (req, res, next) => {
        try {
            let user = req.loggedUser;

            if (user.role !== "DRIVER") {
                throw new ErrorHandler(400, "Forbidden");
            }
            
            next();
        } catch (e) {
            next(e);
        }
    },
    isValidUserData: (req, res, next) => {
        try {
            const { error, value } = userValidators.createUserValidator.validate(req.body);
            if (error) {
                throw new ErrorHandler("400", "Invalid data");
            }
            next();
        } catch (e) {
            next(e);
        }
    },
    isValidUserDataLogin: (req, res, next) => {
        try {
          
            const { error, value } = userValidators.loginValidator.validate(req.body);
            if (error) {
                throw new ErrorHandler("400", "Invalid data");
            }
            next();
        } catch (e) {
            next(e);
        }
    },
}