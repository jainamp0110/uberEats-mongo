const Restaurant = require('../models/restaurant.models');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const mongoose = require('mongoose');

const {
  restaurants,
  restaurant_dishtypes,
  dish_imgs,
  dishes,
  sequelize,
  restaurant_imgs,
} = require('../models/data.model');

// const { body, validationResult } = require('express-validator');

const createRestaurant = async (req, res) => {
  try {
    // Validate user input
    if (!(req.body.name && req.body.email && req.body.password)) {
      res.status(400).send({ error: 'All input is required' });
    }
    const oldRes = await Restaurant.findOne({
      email: req.body.email,
    });

    if (oldRes) {
      res.status(409).send({ error: 'Restaurant Already Exist. Please Login' });
    } else {
      
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const newRestaurant = new Restaurant(req.body);

      const newR = await newRestaurant.save();
      console.log(newR);
      const token = jwt.sign(
          { id: newR._id, email: newR.email, role: 'restaurant' },
          'UberEats',
          {
            expiresIn: '2h',
          }
        );
        res.status(201).json({ token });
    }
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
};

const restaurantLogin = async (req, res) => {

  if (!(req.body.email && req.body.password)) 
    res.status(400).send('All input is required');

  const rest = await Restaurant.findOne({
      email: req.body.email,
  }).select('password');
  // console.log(rest);
  if (!rest) {
    res.status(409).send('Restaurant does not exist');
  } else {
    bcrypt.compare(req.body.password, rest.password, (err, result) => {
      if (err) {
        // handle error
        res.status(409).send('Error Verifying details!!!');
      }
      if (result) {
        // Send JWT
        // Create token
        console.log(rest);
        const token = jwt.sign(
          { id: rest._id, email:req.body.email, role: 'restaurant' },
          'UberEats',
          {
            expiresIn: '2h',
          }
        );
        console.log(token);
        rest.token = token;
        return res.status(201).json({ token });
      }
      return res.json({ success: false, message: 'passwords do not match' });
    });
  }
};

const updateRestaurant = async (req, res) => {
  // console.log('entered nhereree');

  try {
    // console.log('entered',req.params.rid);
    const rest = await Restaurant.findOne({
        _id: mongoose.Types.ObjectId(String(req.params.rid)),
    });

    // console.log(rest);
    if (!rest) return res.status(404).send('Restaurant Not Found');

    if (req.body.email && req.body.email !== rest.email) {
      const checkRest = await Restaurant.findOne({
          email: req.body.email,
      });

      if (checkRest) {
        return res
          .status(403)
          .send('Restaurant already exist with given email');
      }
    }

    await Restaurant.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(req.params.rid)),
      },
      {
        $set: req.body,
      },
    );

    if (req.body.type && req.body.type.length > 0) {
      await Restaurant.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(String(req.params.rid)),
        },
        {
          $set: {type: []},
        },
      );
      
      await Restaurant.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(String(req.params.rid)),
        },
        {
          $set: {type: req.body.type},
        },
      );
    }

    return res.status(200).send({ message: 'Restaurant Updated' });
  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const findEntry = await Restaurant.findOne({
        _id: mongoose.Types.ObjectId(String(req.params.rid)),
    });
    if (!findEntry) {
      res.status(404).send('Restaurant Does not Exist to delete');
    } else {
      await Restaurant.findOneAndDelete({
          _id: mongoose.Types.ObjectId(String(req.params.rid)),
      });
      res.status(201).send({message: 'Restaurant Deleted'});
    }
  } catch (err) {
    res.status(404).send(err);
  }
};

const addRestaurantImage = async (req, res) => {
  if (req.body.imageLink) {
    await Restaurant.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.headers.id),
      },
      {
        $push: {imageLink: req.body},
      },
    );
    return res.status(201).send({message: 'Images added successfully'});
  } else {
    return res.status(500).send({ message: 'Could not add Image' });
  }
};

const deleteRestaurantImage = async (req, res) => {
  if(!req.params.imgId){
    return res.status(404).send({message: 'Image does not exist'});
  }

  try{
    await Restaurant.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.headers.id),
      },
      {
        $pull: {imageLink: {_id: mongoose.Types.ObjectId(req.params.imgId)}},
      },
    );
    return res.status(200).send({message: 'Image removed successfully'});
  }catch(error){
    return res.status(500).send({message: 'Internal Server Error'});
  }
};

const getRestaurantDetails = async (req, res) => {
  if (!req.params.rid) return res.status(404).send('Provide Restaurant ID');

  const filteredRestaurants = await Restaurant.findOne({
    _id: req.params.rid,
  });
  return res.status(201).send(filteredRestaurants);
};

const getRestaurantBySearch = async (req, res) => {
  const { keyWord } = req.query;
  const custId = req.headers.id;
  if(!custId){
    return res.status(403).send({error: 'login Again!!'});
  } 

  const [data, meta] = await sequelize.query(
    `select restaurants.*, restaurant_imgs.* from restaurants join restaurant_imgs on restaurants.r_id = restaurant_imgs.r_id join dishes on restaurants.r_id=dishes.r_id WHERE restaurants.r_name like '%${keyWord}%' or restaurants.r_desc like '%${keyWord}%' or dishes.d_name like '%${keyWord}%' `

    );
  return res.status(200).send(data);
};

const getAllRestaurants = async (req, res) => {
  try {
    // const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

    const { city } = req.query;
    const { dishType } = req.query;
    let { deliveryType } = req.query;

    if (deliveryType === 'Pickup') {
      deliveryType = ['Both', 'Pickup'];
    }
    if (deliveryType === 'Delivery') {
      deliveryType = ['Both', 'Delivery'];
    }

    const searchObject = {
      r_city: city,
      r_delivery_type: deliveryType,
    };

    const checkProperties = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
          // eslint-disable-next-line no-param-reassign
          delete obj[key];
        }
      });
    };

    checkProperties(searchObject);

    let filteredRestaurants = await restaurants.findAll({
      // limit,
      // offset,
      include: [
        {
          model: restaurant_imgs,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
      attributes: { exclude: ['r_password', 'createdAt', 'updatedAt'] },
      where: searchObject,
    });

    if (dishType && dishType.length > 0) {
      const restaurantsFilteredBydishTypes = await restaurant_dishtypes.findAll(
        {
          // limit,
          // offset,
          include: [
            {
              model: restaurants,
              attributes: { exclude: ['r_password', 'createdAt', 'updatedAt'] },
              include: [
                {
                  model: restaurant_imgs,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
              ],
            },
          ],
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { rdt_type: dishType },
        }
      );

      if (filteredRestaurants) {
        if (restaurantsFilteredBydishTypes.length === 0) {
          console.log('bruh1');
          return res.status(200).json([]);
        }

        const filteredRests = [];
        restaurantsFilteredBydishTypes.forEach((dishTypeObj) => {
          const findFlag = _.find(
            filteredRestaurants,
            (item) => item.r_id === dishTypeObj.restaurant.r_id
          );
          if (findFlag) {
            filteredRests.push(dishTypeObj.restaurant);
          }
        });
        filteredRestaurants = _.uniq(filteredRests, 'r_id');
        console.log('bruh2');
        return res.status(200).json({ filteredRestaurants });
      }

      const filteredRests = [];
      restaurantsFilteredBydishTypes.forEach((dishTypeObj) => {
        filteredRests.push(dishTypeObj.restaurant);
      });

      filteredRestaurants = filteredRests;
      console.log('bruh3');
      return res.status(200).json({ filteredRestaurants });
    }

    if (!filteredRestaurants) {
      console.log('bruh4');
      return res.status(200).json({ message: 'No restaurants found!' });
    }
    console.log('bruh5');
    return res.status(200).json({ filteredRestaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// const getAllRestaurants = async (req, res) => {
//   const custId = req.headers.id;
//   const city = req.query.city;
//   const type = req.query.type;
//   const delivery = req.query.delivery;

//   if (!custId) return res.status(404).send({ error: 'Please Login!' });

//   const searchObject = {
//     r_city: city,
//     r_delivery_type: delivery,
//   };

//   const checkProperties = (obj) => {
//     Object.keys(obj).forEach((key) => {
//       if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
//         // eslint-disable-next-line no-param-reassign
//         delete obj[key];
//       }
//     });
//   };

//   checkProperties(searchObject);

//   const restDetails = await restaurants.findAll({
//     include: [
//       {
//         model: restaurant_dishtypes,
//       },
//       {
//         model: restaurant_imgs,
//       },
//       {
//         model: dishes,
//         include: dish_imgs,
//       },
//     ],
//     where: searchObject,
//     attributes: { exclude: ['r_password', 'createdAt', 'updatedAt'] },
//   });
//   return res.status(201).send(restDetails);
//   // if(city!== undefined && city!==null && city !== ''){
//   //   console.log('SAKdsankdj')
//   //   const restDetails = await restaurants.findAll({
//   //     include: [
//   //       {
//   //         model: restaurant_dishtypes,
//   //       },
//   //       {
//   //         model: restaurant_imgs,
//   //       },{
//   //         model: dishes,
//   //         include: dish_imgs,
//   //       }
//   //     ],
//   //     where:{
//   //       r_city: city,
//   //     },
//   //     attributes: { exclude: ['r_password', 'createdAt', 'updatedAt'] },
//   //   });
//   //   return res.status(201).send(restDetails);
//   // }else{
//   //   console.log('INSIDE MAIN LOOP')
//   //   const restDetails = await restaurants.findAll({
//   //     include: [
//   //       {
//   //         model: restaurant_dishtypes,
//   //       },
//   //       {
//   //         model: restaurant_imgs,
//   //       },{
//   //         model: dishes,
//   //         include: dish_imgs,
//   //       }
//   //     ],
//   //     attributes: { exclude: ['r_password', 'createdAt', 'updatedAt'] },
//   //   });
//   //   return res.status(201).send(restDetails);
//   // }
// };

// TO DO: Filter
// Delivery Type
// Location
// Veg Non-Veg Vegan
// Category

// const getRestaurantsByLocation = async (req, res) => {
//   const custId = req.headers.id;
//   const location = req.body.location;

//   if(!custId){
//     return res.status(403).send({error: 'login Again!!'});
//   }

//   const rests = await restaurants.findAll({
//     where:{
//       r_city: location,
//     },
//   });

//   return res.status(200).send({})
// };

module.exports = {
  restaurantLogin,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDetails,
  deleteRestaurantImage,
  addRestaurantImage,
  getAllRestaurants,
  getRestaurantBySearch,
};
