// const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const {
  carts,
  dishes,
  sequelize,
  restaurants,
  dish_imgs,
} = require('../models/data.model');

const Restaurant = require('../models/restaurant.models');
const Cart = require('../models/cart.models');

const getCartDetails = async (req, res) => {
  // const custID = req.headers.id;

  const existCart = await Cart.find({
      custId: req.headers.id,
  });

  if (existCart.length === 0) {
    return res.status(404).send({error: 'No Items in Cart'});
  }

  const cartItems = await Cart.find({
    custId: req.headers.id,
    // include: [
    //   {
    //     model: dishes,
    //     include: dish_imgs,
    //   },
    // ],
    // where: {
    //   c_id: custID,
    // },
  });

  cartItems.forEach(async (ele) => {
    const tempD = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(ele.resId),
      'dishes._id': mongoose.Types.ObjectId(ele.dishId),
    });
    ele = {...ele, ...tempD};
  });
  const r_id = cartItems.length>0?cartItems[0].resId: null;

  if(r_id === null){
    return res.status(201).send({message: 'No Items in cart'}); 
  }

  const restDetails = await Restaurant.findOne({
      _id: r_id,
  });
  return res.status(201).json({ cartItems, restDetails });
};

const addItemToCart = async (req, res) => {

  // const { dishId, restId } = req.body;
  // const custId = req.headers.id;
  if (!(req.body.resId && req.body.dishId)) {
    return res.status(400).send('Provide all details');
  }

  const checkDish = await Restaurant.findOne(
    {
      _id: mongoose.Types.ObjectId(req.body.resId),
      'dishes._id': mongoose.Types.ObjectId(req.body.dishId),
    }
  );

  if (!checkDish) {
    return res.status(404).send('Dish does not exist for given restaurant');
  }

  const checkCart = await Cart.findOne(
    {
      'custId': mongoose.Types.ObjectId(req.headers.id),
    }
  );

  // console.log(String(checkCart.resId));
  // console.log(req.body.resId);
  if (checkCart && String(checkCart.resId) !== req.body.resId) {
    const rest = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(String(checkCart.resId)),
    });

    return res
      .status(409)
      .send({restId:String(checkCart.resId) ,restName: rest.name , error: 'Cannot added dishes for multiple restaurants' });
  }

  const existingDish = await Cart.findOne({
    'custId': mongoose.Types.ObjectId(req.headers.id),
    'resId': mongoose.Types.ObjectId(req.body.resId),
    'dishId': mongoose.Types.ObjectId(req.body.dishId),
  });

  if (existingDish) {
    await Cart.findOneAndUpdate({
      'custId': mongoose.Types.ObjectId(req.headers.id),
      'resId': mongoose.Types.ObjectId(req.body.resId),
      'dishId': mongoose.Types.ObjectId(req.body.dishId),
      },
      {
       $set: {qty: existingDish.qty + 1}
    });

    return res.status(200).send({message: 'Dish Added to Cart'});
  }

  const newCart1 = new Cart({custId: req.headers.id, dishId: req.body.dishId, resId: req.body.resId, qty: 1});
  const nCart1 = await newCart1.save();
  return res.status(201).send({ message: 'Dish Added to Cart' });
};

const resetCart = async (req, res) => {

  // const custId = req.headers.id;
  // const { dishId, restId } = req.body;
  
  if (!(req.body.resId && req.body.dishId)) {
    return res.status(400).send('Provide all details');
  }

  try {
    await Cart.deleteMany({
      custID: req.headers.id,
    });

    const newCart1 = new Cart({custId: req.headers.id, dishId: req.body.dishId, resId: req.body.resId});
    const nCart1 = await newCart1.save();
    return res.status(201).send({ message: 'Dish Added to Cart' });
  } catch (err) {
    return res.status(500).send(err);
  }
};

const deleteCart = async (req, res) => {
  try {
    await Cart.deleteMany({
      custID: req.headers.id,
    });
    res.status(201).send({ message: 'Cart deleted for Customer' });
  } catch (err) {
    res.status(500).send({ error: 'Error Deleting Cart' });
  }
};

const deleteCartItem = async (req, res) => {

  // const custId = req.headers.id;
  // const cartItemId = req.params.cartId;

  try {
    await Cart.deleteOne({
      _id: mongoose.Types.ObjectId(String(req.params.cartId)),
    });

    return res.status(201).send({ message: 'Cart Item Deleted' });
  } catch (err) {
    return res.status(400).send({ error: 'Error Deleting Cart Item' });
  }
};

module.exports = {
  getCartDetails,
  addItemToCart,
  resetCart,
  deleteCart,
  deleteCartItem,
};
