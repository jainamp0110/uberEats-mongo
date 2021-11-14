const bcrypt = require('bcrypt');
const Restaurant = require('../../models/restaurant.models');
const jwt = require('jsonwebtoken');

const handle_request = async (msg, callback) => {
  try {
    // Validate user input
    if (!(msg.name && msg.email && msg.password)) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'All input is required',
        },
        null,
      );
      return;
    }
    const oldRes = await Restaurant.findOne({
      email: msg.email,
    });

    if (oldRes) {
      callback({
        isError: true,
        errorStatus: 409,
        error: 'Restaurant Already Exist. Please Login',
      });
      return;
    } else {
      msg.password = await bcrypt.hash(msg.password, 10);
      const newRestaurant = new Restaurant(msg);

      const newR = await newRestaurant.save();
      console.log(newR);
      const token = jwt.sign(
        { id: newR._id, email: newR.email, role: 'restaurant' },
        'UberEats',
        {
          expiresIn: '2h',
        },
      );
      callback(null, { token });
    }
  } catch (err) {
    console.log(err);
    callback(
      {
        isError: true,
        errorStatus: 500,
        error: err,
      },
      null,
    );
  }
};

module.exports = handle_request;
