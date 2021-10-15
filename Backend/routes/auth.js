/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/// Authentication

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

/// Restaurant Register API
router.post('/resregister', restaurantValidationRules(), validator, createRestaurant);

module.exports = router;
