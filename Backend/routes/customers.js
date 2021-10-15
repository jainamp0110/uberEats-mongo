/* eslint-disable camelcase */
const express = require('express');
const {
  updateCustomer,
  deleteCustomer,
  getCustomerProfile,
  getCustomerById,
  getAllCustomers,
  addAddress,
  getAddress,
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
} = require('../controllers/customer');
const { customerValidationRules, validator } = require('../controllers/validator');

const router = express.Router();

router.put('/:cid', customerValidationRules(), validator, updateCustomer);
router.delete('/:cid', deleteCustomer);
router.get('/', getAllCustomers);

router.get('/myprofile', getCustomerProfile);
router.get('/profile/:cid', getCustomerById);

router.get('/fvrts', getAllFavorites);
router.get('/address', getAddress);
router.post('/address', addAddress);
router.post('/fvrts', addToFavorites);
router.delete('/fvrts/:rid', deleteFromFavorites);


module.exports = router;
