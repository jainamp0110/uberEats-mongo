const mongoose = require('mongoose');

const RestaurantSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
        required: true,
    },
    contactNum: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    address: {
        type: String,
    },
    description: {
        type: String,
    },
    deliveryType: {
        type: String,
        enum: ['Pickup','Delivery','Both'],
    },
    imageLink: [{
        imageLink: { type: String },
    }],
    type: [String],
    dishes: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            ingredients: {
                type: String,
            },
            description: {
                type: String,
            },
            type: {
                type: String,
                enum: ['Appetizer', 'Salad', 'Main Course', 'Dessert', 'Beverage'],
            },
            category: {
                type: String,
                enum: ['Veg', 'Non-veg', 'Vegan'],
            },
            imageLink: [{
                imageLink: { type : String },
            }],
        },
    ],
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);