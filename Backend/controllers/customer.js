const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Customer = require('../models/customer.models');
const Restaurant = require('../models/restaurant.models');
const mongoose = require('mongoose');

const { make_request } = require('../kafka/client');

const createCustomer = async (req, res) => {
  try {
    if (!(req.body.name && req.body.email && req.body.password)) {
      res.status(400).send('All input is required');
    }

    const oldCust = await Customer.findOne({
      email: req.body.email,
    });

    if (oldCust) {
      return res
        .status(409)
        .send({ error: 'User Already Exist. Please Login' });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const newCustomer = new Customer(req.body);
    const newC = await newCustomer.save();

    const token = jwt.sign(
      { id: newC._id, email: newC.email, role: 'customer' },
      'UberEats',
      {
        expiresIn: '2h',
      },
    );

    // save customer token
    newCustomer.token = token;
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(400).send(err);
  }
};

const customerLogin = async (req, res) => {
  if (!(req.body.email && req.body.password))
    res.status(400).send('All input is required');

  const cust = await Customer.findOne({
    email: req.body.email,
  }).select('password');

  if (!cust) {
    res.status(409).send('User does not exist');
  } else {
    bcrypt.compare(req.body.password, cust.password, (err, result) => {
      if (err) {
        // handle error
        res.status(409).send('Error Verifying details!!!');
      }
      if (result) {
        // Send JWT
        const token = jwt.sign(
          { id: cust._id, email: req.body.email, role: 'customer' },
          'UberEats',
          {
            expiresIn: '2h',
          },
        );
        cust.token = token;
        res.status(201).json({ token });
      } else {
        return res.json({ success: false, message: 'passwords do not match' });
      }
    });
  }
};

const updateCustomer = async (req, res) => {
  make_request(
    'customer.update',
    { ...req.params, body: req.body, id: req.headers.id },
    (error, response) => {
      if (error || !response) {
        if ('errorStatus' in error) {
          return res.status(error.errorStatus).json({ error: error.error });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ rest: { ...response } });
    },
  );
};

const addAddress = async (req, res) => {
  try {
    if (!req.headers.id || req.headers.role === 'restaurant') {
      return res.status(401).send({ error: 'Unauthorised Access' });
    }
    if (
      !(
        req.body.addressLine &&
        req.body.zipcode &&
        req.body.city &&
        req.body.state &&
        req.body.country
      )
    ) {
      return res.status(403).send('Provide all Details');
    }
    if (req.headers.role === 'customer') {
      await Customer.findByIdAndUpdate(
        {
          _id: mongoose.Types.ObjectId(String(req.headers.id)),
        },
        {
          $push: { addresses: req.body },
        },
      );
    }
    res.status(201).send({ msg: 'Address Added' });
  } catch (err) {
    res.status(500).send(err);
  }
};

// all addresses
const getAllAddress = async (req, res) => {
  const custId = req.headers.id;

  try {
    const custAddr = await Customer.findOne({
      _id: mongoose.Types.ObjectId(req.headers.id),
    });

    if (custAddr.addresses.length === 0 || !custAddr) {
      return res.staus(404).send({ error: 'No Addresses Found' });
    }
    return res.status(201).send(custAddr.addresses);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateAddress = async (req, res) => {
  const addr = await Customer.findOne({
    _id: mongoose.Types.ObjectId(String(req.headers.id)),
    'addresses._id': mongoose.Types.ObjectId(String(req.params.aid)),
  });

  if (!addr) {
    return res.status(404).send('Address Does not exist!!');
  }
  try {
    const updObj = {};
    Object.keys(req.body).forEach((ele) => {
      updObj[`addresses.$.${ele}`] = req.body[ele];
    });

    await Customer.updateOne(
      {
        _id: mongoose.Types.ObjectId(req.headers.id),
        'addresses._id': mongoose.Types.ObjectId(req.params.aid),
      },
      {
        $set: updObj,
      },
    );
    res.status(201).send('Address Updated');
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteAddress = async (req, res) => {
  if (!req.params.aid) {
    return res.status(404).send('Need Address ID');
  }

  const cust = await Customer.findOne({
    _id: mongoose.Types.ObjectId(String(req.headers.id)),
    'addresses._id': mongoose.Types.ObjectId(String(req.params.aid)),
  });

  if (!cust) return res.status(403).send('Address does not exist');

  try {
    await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(req.headers.id)),
      },
      {
        $pull: { addresses: { _id: mongoose.Types.ObjectId(req.params.aid) } },
      },
    );

    return res.status(201).send('Address deleted');
  } catch (err) {
    return res.status(404).send(err);
  }
};
const deleteCustomer = async (req, res) => {
  if (!req.params.cid) return res.status(404).send('Need Customer ID');

  const cust = await Customer.findOne({
    _id: mongoose.Types.ObjectId(String(req.params.cid)),
  });

  if (!cust) return res.status(403).send('Customer does not exist');
  try {
    await Customer.findOneAndDelete({
      _id: mongoose.Types.ObjectId(String(req.params.cid)),
    });

    return res.status(201).send('Customer deleted');
  } catch (err) {
    return res.status(404).send(err);
  }
};

const getCustomerById = async (req, res) => {
  try {
    console.log(req.params.cid);
    const cust = await Customer.findOne({
      _id: mongoose.Types.ObjectId(String(req.params.cid)),
    });

    if (!cust) {
      return res.status(404).send('Customer does not exists');
    }
    return res.status(201).send(cust);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Error getting Customer by Id' });
  }
};

const addToFavorites = async (req, res) => {
  const custId = req.headers.id;
  const restId = req.body.rid;
  if (!req.headers.id) {
    return res.status(404).send({ error: 'Customer Id Not FOund' });
  }

  try {
    const findRest = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(String(req.body.rid)),
    });

    if (!findRest) {
      return res.status(404).send({ error: 'Restaurant do not exist' });
    }

    await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(req.headers.id)),
      },
      {
        $push: { favorites: req.body.rid },
      },
    );
  } catch (err) {
    return res.status(500).send(err);
  }

  return res.status(200).send({ message: 'Added to Favorites' });
};

const deleteFromFavorites = async (req, res) => {
  const custId = req.headers.id;
  const restId = req.params.rid;
  if (!req.headers.id) {
    return res.status(404).send({ error: 'Customer Id Not FOund' });
  }

  try {
    await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(req.headers.id)),
      },
      {
        $pull: { favorites: req.params.rid },
      },
    );
  } catch (err) {
    return res.status(500).send(err);
  }

  return res.status(200).send({ message: 'Removed from Favorites' });
};

const getAllFavorites = async (req, res) => {
  console.log(req.headers.id);
  if (!req.headers.id) {
    return res.status(404).send({ error: 'Customer Id Not Found' });
  }

  try {
    const cust = await Customer.findOne({
      _id: mongoose.Types.ObjectId(String(req.headers.id)),
    });

    console.log(cust);

    const resArray = await Restaurant.find({
      _id: { $in: cust.favorites },
    });

    return res.status(200).send(resArray);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  createCustomer,
  customerLogin,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  addAddress,
  getAllAddress,
  addToFavorites,
  deleteFromFavorites,
  getAllFavorites,
  updateAddress,
  deleteAddress,
};
