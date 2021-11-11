const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    custId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    resId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    dishId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Cart', CartSchema);