const jwt = require("jsonwebtoken");
const config = require("../configs/config")
const ErrorHandler = require("../errors/ErrorHandler")

module.exports = {
    generateTokenPair: () => {
        const access_token = jwt.sign({}, config.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
        return {
            access_token
        }
    },
    verifyToken: (token) => {
        try {
            const secret = config.ACCESS_TOKEN_SECRET 
            jwt.verify(token, secret);
        } catch (e) {
            throw new ErrorHandler(400, "Error message")
        }

    }
};
