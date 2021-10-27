const { Schema, model } = require("mongoose");

const loadSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    status: {
        type: String,
        required: true,
        enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'],
        default: 'NEW',
    },
    state: {
        type: String,
        enum: [
            'En route to Pick Up',
            'Arrived to Pick Up',
            'En route to Delivery',
            'Arrived to Delivery',
            null
        ],
        default: null,
    },
    dimensions: {
        width: {
            type: Number,
            required: true,
            min: 0,
            max: 1000
        },
        length: {
            type: Number,
            required: true,
            min: 0,
            max: 1000
        },
        height: {
            type: Number,
            required: true,
            min: 0,
            max: 1000
        },
    },
    name: {
        type: String,
        required: true
    },
    payload: {
        type: Number,
        required: true
    },
    pickup_address: {
        type: String,
        required: true,
    },
    delivery_address: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = model('load', loadSchema);