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

router.post('/neworder', createOrder);
router.get('/filterorders?', filterOrders);
router.put('/finalorder', placeOrder);
router.put('/updatestatus/:oid', updateOrder);
router.get('/', getOrders);
router.get('/:oid', getOrderById);

module.exports = router;
