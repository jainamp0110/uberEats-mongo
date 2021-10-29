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
    dob: {
        type: Date,
    },
    zipcode: {
        type: String,
    },
    nickName: {
        type: String,
    },
    imageLink: {
        type: String,
    },
    favorites: [],
});

module.exports = mongoose.model('Customer', CustomerSchema);