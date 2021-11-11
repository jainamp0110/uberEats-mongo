const express = require('express');

const {
  getCartDetails,
  addItemToCart,
  resetCart,
  deleteCart,
  deleteCartItem,
} = require('../controllers/cart');

const router = express.Router();

/**
 * @route GET /cart/
 * @group Cart
 * @returns {object} 200 - Fetched successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.get('/', getCartDetails);

/**
 * @typedef AddCart
 * @property {string} resId.required 
 * @property {string} dishId.required
 */

/**
 * @route POST /cart/add
 * @group Cart
 * @param {AddCart.model} AddCart.body.required 
 * @returns {object} 201 - Login success with token
 * @returns {Error}  400 - Bad request 
 * @returns {Error} 409 - Email or Password Incorrect
 * @security JWT
 */
router.post('/add', addItemToCart);

/**
 * @route DELETE /cart/item/{cartId}
 * @group Cart
 * @param {string} cartId.path.required
 * @returns {object} 200 - Fetched successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.delete("/item/:cartId", deleteCartItem);


/**
 * @typedef AddCart
 * @property {string} resId.required 
 * @property {string} dishId.required
 */

/**
 * @route POST /cart/reset
 * @group Cart
 * @param {AddCart.model} AddCart.body.required 
 * @returns {object} 201 - Login success with token
 * @returns {Error}  400 - Bad request 
 * @returns {Error} 409 - Email or Password Incorrect
 * @security JWT
 */
router.post('/reset', resetCart);

/**
 * @route DELETE /cart/
 * @group Cart
 * @returns {object} 200 - Fetched successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.delete('/', deleteCart);

module.exports = router;
