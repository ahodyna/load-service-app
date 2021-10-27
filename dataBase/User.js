const { Schema, model } = require("mongoose");
const passwordService = require("../services/password.services");
const dataBaseTablesEnum = require('../configs/dataBaseTables.enum');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['DRIVER', 'SHIPPER']
    }
}, { timestamps: true });

userSchema.statics = {
    async createWithHashPassword(userObject) {

        const hashPassword = await passwordService.hash(userObject.password);

        return this.create({ password: hashPassword, email: userObject.email, role: userObject.role });
    }
};
module.exports = model(dataBaseTablesEnum.USER, userSchema);