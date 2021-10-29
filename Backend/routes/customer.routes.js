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

/*{
  "name": "Het Updated",
  "about": "he is very good",
  "contactNum": "1234443211",
  "city": "San Jose",
  "state": "California",
  "dob": "2021-10-25T22:46:14.526+00:00",
  "nickName": "Heta",
  "imageLink": "https://ubereats-media.s3.amazonaws.com/Lento-Restaurant-Rochester-NY-01.jpg"
}*/

/**
 * @typedef UpdateCustomer
 * @property {string} name 
 * @property {string} about
 * @property {string} contactNum 
 * @property {string} city 
 * @property {string} state 
 * @property {string} dob 
 * @property {string} nickName 
 * @property {string} imageLink
*/

/**
 * @route PUT /customers/{cid}
 * @group Customer
 * @param {string} cid.path.required
 * @param {UpdateCustomer.model} UpdateCustomer.body.required 
 * @returns {object} 200 - Updated successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.put('/:cid', customerValidationRules(), validator, updateCustomer);

/**
 * @route DELETE /customers/{cid}
 * @group Customer
 * @param {string} cid.path.required
 * @returns {object} 201 - Deleted successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
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
