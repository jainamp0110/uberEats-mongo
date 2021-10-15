const express = require('express');
const {
  getCartDetails,
  addItemToCart,
  resetCart,
  deleteCart,
  deleteCartItem,
} = require('../controllers/cart');

const router = express.Router();

router.get('/', getCartDetails);

router.post('/add', addItemToCart);

router.delete("/item/:cartId", deleteCartItem);

router.post('/reset', resetCart);

router.delete('/', deleteCart);

module.exports = router;
