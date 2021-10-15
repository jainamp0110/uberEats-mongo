/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { restaurants, customers } = require('../models/data.model');

function validateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, 'UberEats', async (err, data) => {
      if (err) {
        return res.status(401).send('Unauthorised Access Token');
      }
      if (!data.role) {
        return res.status(400).send('Incomplete Information');
      }
      if (data.role === 'restaurant') {
        if (!(data.email && data.r_id)) {
          return res.status(400).send('Incomplete Information');
        }
        const rest = await restaurants.findOne({
          where: {
            r_email: data.email,
          },
        });
        if (!rest) {
          return res
            .status(209)
            .send('Permissions Required For accessing Restuarant');
        }
        req.headers.role = 'restaurant';
        req.headers.id = data.r_id;
        next();
      } else if (data.role === 'customer') {
        if (!(data.email && data.c_id)) {
          return res.status(400).send('Incomplete Information');
        }

        const cust = await customers.findOne({
          where: {
            c_email: data.email,
          },
        });

        if (!cust) {
          return res
            .status(209)
            .send('Permissions Required For accessing Customers');
        }
        req.headers.role = 'customer';
        req.headers.id = data.c_id;

        next();
      } else {
        return res.status(400).send('Error while Authorization');
      }
    });
  }
}

exports.validateToken = validateToken;
