const { Schema, model } = require('mongoose');

const schema = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    assigned_to: {
        type: Schema.Types.ObjectId,
        ref: 'user', default: null
    },
    status: {
        type: String,
        enum: ['IS', 'OL'],
        default: 'IS'
    },
    type: {
        type: String,
        required: true,
        enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
    }
}, { timestamps: true });

module.exports = model('truck', schema);