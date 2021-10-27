const bcrypt = require("bcryptjs");
const ErrorHandler = require("../errors/ErrorHandler");

const lengthPassword = 10;

module.exports = {
    hash: (password) => bcrypt.hash(password, lengthPassword),
    compare: async (password, hashPassword) => {
        const isPasswordMatched = await bcrypt.compare(password, hashPassword);

        if (!isPasswordMatched) {
            throw new ErrorHandler(400, "Unexpected password");
        }
    }
};
