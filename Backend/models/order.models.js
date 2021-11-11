const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    custId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    resId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    dishes: [{
        id: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
    }],
    notes: {
        type: String,
    },
    addressId: {
        type: mongoose.Types.ObjectId, 
        required: true,
    },
    status: {
        type: String,
        enum: [
            'Initialized',
            'Placed',
            'Preparing',
            'Ready',
            'Picked Up',
            'On the Way',
            'Delivered',
            'Cancelled',
        ],
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    orderType: {
        type: String,
        enum: ['Pickup', 'Delivery'],
    },
    tax: {
        type: Number,
    },
    finalPrice: {
        type: Number,
    },
});

module.exports = mongoose.model('Order',OrderSchema);
