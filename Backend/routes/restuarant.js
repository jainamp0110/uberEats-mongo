const express = require('express');

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

// Updating Restaurant Details
router.put('/:rid', restaurantValidationRules(), validator, updateRestaurant);
// Delete Restaurant
router.delete('/:rid', deleteRestaurant);
router.get('/rest/:rid', getRestaurantDetails);
router.get('/all/search?', getRestaurantBySearch);
router.get('/all?', getAllRestaurants);
router.post('/restImages/', addRestaurantImage)
router.delete('/restImages/:imgId', deleteRestaurantImage);
module.exports = router;
