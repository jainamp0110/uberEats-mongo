/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const express = require('express');

const {
  createOrder,
  placeOrder,
  updateOrder,
  getOrders,
  getOrderById,
  filterOrders,
} = require('../controllers/order');

const router = express.Router();

/**
 * @typedef AddOrder
 * @property {string} addressId.required 
 * @property {string} orderType.required
 */

/**
 * @route POST /orders/neworder
 * @group Order
 * @param {AddOrder.model} AddOrder.body.required 
 * @returns {object} 201 - Login success with token
 * @returns {Error}  400 - Bad request 
 * @returns {Error} 409 - Email or Password Incorrect
 * @security JWT
 */
router.post('/neworder', createOrder);

/**
 * @route GET /orders/filterorders/
 * @group Order
 * @param {string} page.query
 * @param {string} limit.query
 * @param {string} orderStatus.query
 * @returns {object} 200 - Fetched successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.get('/filterorders?', filterOrders);

/**
 * @typedef FinalOrder
 * @property {string} addressId 
 * @property {string} orderType
*/

/**
 * @route PUT /orders/finalorder/{id}
 * @group Order
 * @param {string} id.path.required
 * @param {FinalOrder.model} FinalOrder.body.required 
 * @returns {object} 200 - Updated successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.put('/finalorder/:id', placeOrder);

/**
 * @typedef UpdateStatus
 * @property {string} status 
*/

/**
 * @route PUT /orders/updatestatus/{id}
 * @group Order
 * @param {string} id.path.required
 * @param {UpdateStatus.model} UpdateStatus.body.required 
 * @returns {object} 200 - Updated successfully
 * @returns {Error}  404 - Not found 
 * @security JWT
 */
router.put('/updatestatus/:oid', updateOrder);

/**
 * @route GET /orders/
 * @group Order
 * @returns {object} 200 - Fetched successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.get('/', getOrders);

/**
 * @route GET /orders/{oid}
 * @group Order
 * @returns {object} 200 - Fetched successfully
 * @returns {Error}  404 - Not found
 * @returns {Error} 500 - Internal Server Error 
 * @security JWT
 */
router.get('/:oid', getOrderById);

module.exports = router;
