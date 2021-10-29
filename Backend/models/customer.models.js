const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
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
    about: {
        type: String,
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
    country: {
        type: String,
    },
    dob: {
        type: Date,
    },
    nickName: {
        type: String,
    },
    imageLink: {
        type: String,
    },
    favorites: [mongoose.Types.ObjectId],
    addresses: [new mongoose.Schema({
        addressLine: {
            type: String,
            required: true,
        },
        zipcode: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    })],
});

module.exports = mongoose.model('Customer', CustomerSchema);