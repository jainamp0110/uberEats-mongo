const express = require('express');

/*
{
  "name": "harshil string",
  "description": "harshil desc",
  "contactNum": "5105431234",
  "city": "San Jose",
  "state": "CA",
  "address": "1306 The Alameda",
  "deliveryType": "Pickup",
  "type": "Vegan",
  "startTime": "2021-10-25T22:46:14.526Z",
  "endTime": "2021-10-25T22:46:14.526Z",
  "zipcode": "95126"
}
*/

const {
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDetails,
  deleteRestaurantImage,
  addRestaurantImage,
  getAllRestaurants,
  getRestaurantBySearch,
} = require('../controllers/restaurant');

const { restaurantValidationRules, validator } = require('../controllers/validator');

const router = express.Router();

/**
 * @typedef UpdateRestaurant
 * @property {string} name 
 * @property {string} description
 * @property {string} contactNum 
 * @property {string} city 
 * @property {string} state 
 * @property {string} address 
 * @property {string} deliveryType 
 * @property {[string]} type
 * @property {string} startTime  
 * @property {string} endTime  
 * @property {string} zipcode
*/
/**
 * @route PUT /restaurants/{rid}
 * @group Restaurant
 * @param {string} rid.path.required
 * @param {UpdateRestaurant.model} UpdateRestaurant.body.required 
 * @returns {object} 200 - Updated successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.put('/:rid', restaurantValidationRules(), validator, updateRestaurant);

/**
 * @route DELETE /restaurants/{rid}
 * @group Restaurant
 * @param {string} rid.path.required
 * @returns {object} 201 - Deleted successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.delete('/:rid', deleteRestaurant);


/**
 * @route GET /restaurants/rest/{rid}
 * @group Restaurant
 * @param {string} rid.path.required
 * @returns {object} 201 - Fetched successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.get('/rest/:rid', getRestaurantDetails);


router.get('/all/search?', getRestaurantBySearch);
router.get('/all?', getAllRestaurants);

/**
 * @typedef RestaurantImage
 * @property {[string]} imageLink
*/

/**
 * @route POST /restaurants/restImages/
 * @group Restaurant
 * @param {RestaurantImage.model} RestaurantImage.body.required 
 * @returns {object} 201 - Updated successfully
 * @returns {Error}  500 - Internal Server Error 
 * @security JWT
 */
router.post('/restImages/', addRestaurantImage)

// https://ubereats-media.s3.amazonaws.com/Lento-Restaurant-Rochester-NY-01.jpg
/**
 * @route DELETE /restaurants/restImages/{imgId}
 * @group Restaurant
 * @param {string} imgId.path.required
 * @returns {object} 200 - Deleted successfully
 * @returns {Error}  500 - Internal Server Error 
 * @security JWT
 */
router.delete('/restImages/:imgId', deleteRestaurantImage);

module.exports = router;
