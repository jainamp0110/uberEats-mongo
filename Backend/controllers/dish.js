/* eslint-disable camelcase */
/* eslint-disable consistent-return */

const mongoose = require('mongoose');

const Restaurant = require('../models/restaurant.models');

const createDish = async (req, res) => {
  try {
    if (!(req.body.name && req.body.price && req.body.category && req.body.type)) {
      return res.status(403).send("Provide all Details");
    }

    const dishId = mongoose.Types.ObjectId();
    await Restaurant.findOneAndUpdate(
      {
        _id: req.headers.id,
      },
      {
        $push: {dishes: {_id: dishId, ...req.body}},
      },
    );
    res.status(201).send({dishId, message: 'Dish created successfully'});
  } catch (err) {
    res.status(404).send(err);
  }
};

const updateDish = async (req, res) => {
  const existDish = await Restaurant.findOne(
    {
      _id: mongoose.Types.ObjectId(req.headers.id),
      'dishes._id': mongoose.Types.ObjectId(req.params.did),
    }
  );

  if (!existDish) return res.status(404).send("Dish Does not exist!!");
  
  try {
    const updObj = {};
    Object.keys(req.body).forEach((ele) => {
      updObj[`dishes.$.${ele}`] = req.body[ele];
    });

    await Restaurant.updateOne(
      {
        _id: mongoose.Types.ObjectId(req.headers.id),
        'dishes._id': mongoose.Types.ObjectId(req.params.did),
      },
      {
        $set: updObj,
      }
    );
    res.status(201).send("Dish Updated!!");
  } catch (err) {
    return res.status(500).send(err);
  }
};

const deleteDish = async (req, res) => {
  if (!req.params.did) return res.status(404).send("Dish Does not Exist");
  
  try {
    const existingDish = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(req.headers.id),
      'dishes._id': mongoose.Types.ObjectId(req.params.did),
    });
    if(!existingDish)
      return res.status(404).send({message: 'Not found'});
    
    await Restaurant.findByIdAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.headers.id),
      },
      {
        $pull: {dishes: {_id: mongoose.Types.ObjectId(req.params.did)}},
      }
    );  
    return res.status(201).send({ message: "Dish Deleted" });
  } catch (err) {
    return res.status(500).send(err);
  }
};

const getDishById = async (req, res) => {
  const dishId = req.params.did;
  const restId = req.headers.id;

  const restau = await Restaurant.findOne({
    _id: mongoose.Types.ObjectId(req.headers.id),
    'dishes._id': mongoose.Types.ObjectId(req.params.did),
  });

  if (!restau) return res.status(404).send("Dish not found");
  return res.status(201).send(restau.dishes[0]);
};

const getAllDishes = async (req, res) => {
  const dishDetails = await Restaurant.findOne({
    _id: mongoose.Types.ObjectId(req.headers.id),
  });
  if (dishDetails.length === 0) {
    return res.status(404).send({ error: "No Dishes Found" });
  }
  return res.status(201).send(dishDetails.dishes);
};

const insertDishImage = async (req, res) => {
  const restId = req.headers.id;
  const dishId = req.params.did;

  if(!req.body.imageLink){
    return res.status(400).send({error: 'Provide all details'});
  }

  if (!dishId) return res.status(403).send("Provide all Details");
  const existDish = await Restaurant.findOne({
    _id: mongoose.Types.ObjectId(restId),
    'dishes._id': mongoose.Types.ObjectId(dishId),
  });

  if (!existDish) return res.status(404).send("Dish Does not exist!!");

  const nImg = await Restaurant.findOneAndUpdate({
    _id: mongoose.Types.ObjectId(restId),
    'dishes._id': mongoose.Types.ObjectId(dishId),
  },
  {
    $push: {'dishes.$.imageLink':  req.body.imageLink},
  },{
    new: true,
  }
  );

  return res.status(201).send({ message: "Dish image Added" });
};

module.exports = {
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  getAllDishes,
  insertDishImage,
};
