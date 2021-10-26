const express = require('express');
const { createDish, updateDish, deleteDish, getDishById, getAllDishes, insertDishImage, deleteDishImage } = require('../controllers/dish');
const { dishDetailsValidator, validator } = require('../controllers/validator');

const router = express.Router();

/**
 * @typedef CreateDish
 * @property {string} name 
 * @property {integer} price
 * @property {string} type 
 * @property {string} category 
*/

/**
 * @route POST /dishes/newdish
 * @group Dish
 * @param {CreateDish.model} CreateDish.body.required 
 * @returns {object} 201 - Created successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 403 - Provide All details 
 * @security JWT
 */
router.post('/newdish', dishDetailsValidator(), validator, createDish);

/**
 * @typedef UpdateDish
 * @property {string} name 
 * @property {integer} price
 * @property {string} type 
 * @property {string} category
 * @property {string} ingredients
 * @property {string} description 
*/

/**
 * @route PUT /dishes/{did}
 * @group Dish
 * @param {string} did.path.required
 * @param {UpdateDish.model} UpdateDish.body.required 
 * @returns {object} 200 - Updated successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.put('/:did', dishDetailsValidator(), validator, updateDish);

/**
 * @route DELETE /dishes/{did}
 * @group Dish
 * @param {string} did.path.required
 * @returns {object} 200 - Fetched successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.delete('/:did', deleteDish);

/**
 * @route GET /dishes/{did}
 * @group Dish
 * @param {string} did.path.required
 * @returns {object} 200 - Deleted successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.get('/:did', getDishById);


// router.post('/images/:did', insertDishImage);


// router.delete('/images/:imgId', deleteDishImage);

/**
 * @route GET /dishes/
 * @group Dish
 * @returns {object} 200 - Fetched successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.get('/', getAllDishes);

module.exports = router;
