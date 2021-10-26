/* eslint-disable camelcase */
/* eslint-disable consistent-return */

const mongoose = require('mongoose');

const {
  dishes,
  dish_imgs,
  sequelize,
  restaurants,
} = require("../models/data.model");

const Restaurant = require('../models/restaurant.models');

const createDish = async (req, res) => {
  try {
    if (!(req.body.name && req.body.price && req.body.category && req.body.type)) {
      return res.status(403).send("Provide all Details");
    }

    await Restaurant.findOneAndUpdate(
      {
        _id: req.headers.id,
      },
      {
        $push: {dishes: req.body},
      },
    );
    res.status(201).send({message: 'Dish created successfully'});
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
  const imageLink = req.body.img;

  if (!dishId) return res.status(403).send("Provide all Details");
  const existDish = await dishes.findOne({
    where: {
      d_id: dishId,
      r_id: restId,
    },
  });

  if (!existDish) return res.status(404).send("Dish Does not exist!!");

  await dish_imgs.create({
    di_img: imageLink,
    di_alt_text: "Dish image",
    d_id: dishId,
  });

  return res.status(201).send({ message: "Dish image Added" });
};

const deleteDishImage = async (req, res) => {
  const restId = req.headers.id;
  const dishImageId = req.params.imgId;

  const existDishImage = await dish_imgs.findOne({
    where: {
      di_id: dishImageId,
    },
  });

  if (!existDishImage) return res.status(404).send("Dish Does not exist!!");

  await dish_imgs.destroy({
    where: {
      di_id: dishImageId,
    },
  });
  return res.status(201).send({ message: "Dish image Deleted" });
};

module.exports = {
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  getAllDishes,
  insertDishImage,
  deleteDishImage,
};
