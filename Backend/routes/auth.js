const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line camelcase

const { createCustomer, customerLogin } = require('../controllers/customer');
const { restaurantLogin, createRestaurant } = require('../controllers/restaurant');
const { validator, restaurantValidationRules, customerValidationRules } = require('../controllers/validator');

/**
 * @typedef RegisterCustomer
 * @property {string} email.required 
 * @property {string} password.required
 * @property {string} name.required
 */

/**
 * @route POST /auth/register
 * @group Register
 * @param {RegisterCustomer.model} RegisterCustomer.body.required 
 * @returns {object} 201 - An array of Customer info
 * @returns {Error}  400 - Bad request 
 * @returns {Error} 409 - Customer already exist
 */
router.post('/register', customerValidationRules(), validator, createCustomer);

/**
 * @typedef LoginCustomer
 * @property {string} email.required 
 * @property {string} password.required
 */

/**
 * @route POST /auth/login
 * @group Login
 * @param {LoginCustomer.model} LoginCustomer.body.required 
 * @returns {object} 201 - Login success with token
 * @returns {Error}  400 - Bad request 
 * @returns {Error} 409 - Email or Password Incorrect
 */
router.post('/login', customerValidationRules(), validator, customerLogin);

/**
 * @typedef LoginRestaurant
 * @property {string} email.required 
 * @property {string} password.required
 */

/**
 * @route POST /auth/reslogin
 * @group Login
 * @param {LoginRestaurant.model} LoginRestaurant.body.required 
 * @returns {object} 201 - Login success with token
 * @returns {Error}  400 - Bad request 
 * @returns {Error} 409 - Email or Password Incorrect
 */
router.post('/reslogin', restaurantValidationRules(), validator, restaurantLogin);

/**
 * @typedef RegisterRestaurant
 * @property {string} email.required 
 * @property {string} password.required
 * @property {string} name.required
 */

/**
 * @route POST /auth/resregister
 * @group Register
 * @param {RegisterRestaurant.model} RegisterRestaurant.body.required 
 * @returns {object} 201 - An array of user info
 * @returns {Error}  400 - Bad request 
 * @returns {Error} 409 - Restaurant already exist
 */
router.post('/resregister',restaurantValidationRules(), validator, createRestaurant);

module.exports = router;
