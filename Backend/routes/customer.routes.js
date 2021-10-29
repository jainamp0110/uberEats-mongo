/* eslint-disable camelcase */
const express = require('express');
const {
  updateCustomer,
  deleteCustomer,
  getCustomerProfile,
  getCustomerById,
  getAllCustomers,
  addAddress,
  getAllAddress,
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
  updateAddress,
  deleteAddress,
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

/**
 * @route GET /customers/fvrts
 * @group Favorites
 * @returns {object} 201 - Fetched successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.get('/fvrts', getAllFavorites);

/**
 * @route GET /customers/address
 * @group Address
 * @returns {object} 201 - Fetched successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.get('/address', getAllAddress);

/**
 * @typedef Address
 * @property {string} addressLine 
 * @property {string} zipcode
 * @property {string} city 
 * @property {string} state 
 * @property {string} country 
*/

/**
 * @route POST /customers/address/
 * @group Address
 * @param {Address.model} Address.body.required 
 * @returns {object} 200 - Updated successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.post('/address', addAddress);

/**
 * @typedef Address
 * @property {string} addressLine 
 * @property {string} zipcode
 * @property {string} city 
 * @property {string} state 
 * @property {string} country 
*/

/**
 * @route PUT /customers/address/{aid}
 * @group Address
 * @param {string} aid.path.required
 * @param {Address.model} Address.body.required 
 * @returns {object} 200 - Updated successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.put('/address/:aid',updateAddress);

/**
 * @route DELETE /customers/address/{aid}
 * @group Address
 * @param {string} aid.path.required
 * @returns {object} 200 - Deleted successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.delete('/address/:aid',deleteAddress);

/**
 * @typedef CreateFavorite
 * @property {string} rid 
*/
/**
 * @route POST /customers/fvrts
 * @group Favorites
 * @param {CreateFavorite.model} CreateFavorite.body.required 
 * @returns {object} 200 - Updated successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.post('/fvrts', addToFavorites);

/**
 * @route DELETE /customers/fvrts/{rid}
 * @group Favorites
 * @param {string} rid.path.required
 * @returns {object} 201 - Deleted successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.delete('/fvrts/:rid', deleteFromFavorites);


module.exports = router;
