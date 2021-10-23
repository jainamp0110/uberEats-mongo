const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line camelcase

const { createCustomer, customerLogin } = require('../controllers/customer');
const { restaurantLogin, createRestaurant } = require('../controllers/restaurant');
const { validator, restaurantValidationRules, customerValidationRules } = require('../controllers/validator');

/// Customer Registration API
router.post('/register', customerValidationRules(), validator, createCustomer);

/// Customer Login API
router.post('/login', customerValidationRules(), validator, customerLogin);

/// Restuarant Registration API
router.post('/reslogin', restaurantValidationRules(), validator, restaurantLogin);

/**
 * @typedef RegisterRestaurant
 * @property {string} email.required 
 * @property {string} password.required
 * @property {string} name.required
 */

/**
 * @route POST /auth/resregister
 * @group Register - Registration
 * @param {RegisterRestaurant.model} RegisterRestaurant.body.required 
 * @returns {object} 201 - An array of user info
 * @returns {Error}  400 - Bad request 
 * @returns {Error} 409 - Restaurant already exist
 */
router.post('/resregister',restaurantValidationRules(), validator, createRestaurant);

module.exports = router;
