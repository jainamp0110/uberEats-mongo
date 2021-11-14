/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */

const { mongo, Mongoose } = require('mongoose');

const mongoose = require('mongoose');

const Cart = require('../models/cart.models');
const Order = require('../models/order.models');
const Restaurant = require('../models/restaurant.models');
const Customer = require('../models/customer.models');
const { count } = require('../models/cart.models');
const { make_request } = require('../kafka/client');

const createOrder = async (req, res) => {
  //const custId = req.headers.id;

  console.log('IN CREATE ORDER');
  // if (!(req.body.addressId && req.body.orderType)) {
  //   return res.status(400).send({ message: 'Provide All Details' });
  // }

  const cartDetails = await Cart.find({
    custId: mongoose.Types.ObjectId(req.headers.id),
  });

  if (cartDetails.length === 0) {
    return res.status(404).send('No Items in Cart');
  }

  const mp = new Map();

  console.log('Cart Details', cartDetails);
  const r = await Restaurant.findOne({
    _id: mongoose.Types.ObjectId(String(cartDetails[0].resId)),
  });

  r.dishes.forEach((element) => {
    mp.set(element._id.toString(), element);
  });

  console.log(mp);
  let dishDetails = [];
  cartDetails.forEach((element) => {
    // console.log(element);
    dishDetails.push({
      id: element.dishId.toString(),
      price: parseFloat(mp.get(element.dishId.toString()).price),
      qty: parseInt(element.qty),
    });
  });

  let sum = 0;
  dishDetails.forEach((element) => {
    sum += parseFloat(element.qty) * parseFloat(element.price);
  });

  try {
    const orderObj = {};
    orderObj.custId = req.headers.id;
    orderObj.resId = cartDetails[0].resId;
    orderObj.dishes = [];
    orderObj.dishes = dishDetails;
    orderObj.status = 'Initialized';
    // if (req.body.notes) {
    //   orderObj.notes = req.body.notes;
    // }
    // orderObj.addressId = req.body.addressId;
    // orderObj.dateTime = new Date().toString();
    // orderObj.orderType = req.body.orderType;

    orderObj.tax = sum * 0.18;
    orderObj.finalPrice = parseFloat(sum) + parseFloat(orderObj.tax);
    const newOrd = new Order(orderObj);
    const newO = await newOrd.save();

    await Cart.deleteMany({
      custId: mongoose.Types.ObjectId(String(req.headers.id)),
    });

    return res.status(201).send(newO);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const placeOrder = async (req, res) => {
  make_request(
    'order.place',
    { ...req.params, body: req.body },
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

const updateOrder = async (req, res) => {
  const { status } = req.body;
  const { oid } = req.params;

  const o = await Order.findOne({
    _id: mongoose.Types.ObjectId(String(oid)),
  });

  if (
    req.headers.role === 'customer' &&
    status === 'Cancelled' &&
    o.status !== 'Initialized' &&
    o.status !== 'Placed'
  ) {
    return res.status(409).send({ error: 'Order cannot be cancelled' });
  }

  try {
    const updateStatus = await Order.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(req.params.oid)),
      },
      {
        $set: { status: status },
      },
      {
        new: true,
      },
    );

    if (!updateStatus) {
      return res.status(404).send({ error: 'Order Not found' });
    }
    return res.status(201).send({ message: 'Order Status Updated' });
  } catch (err) {
    console.log('Error IN order');

    return res.status(404).send(err);
  }
};

const filterOrders = async (req, res) => {
  const { role, id } = req.headers;
  const { page = 1, limit = 5, orderStatus } = req.query;

  let orders;

  const checkProperties = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
        delete obj[key];
      }
    });
  };

  if (role === 'customer') {
    const prms = {
      custId: mongoose.Types.ObjectId(String(id)),
      status: orderStatus,
    };

    checkProperties(prms);
    const cOrd = await Order.find(prms);

    const cnt = cOrd.length;
    orders = await Order.aggregate([
      {
        $lookup: {
          from: 'restaurants',
          localField: 'resId',
          foreignField: '_id',
          as: 'Restaurant',
        },
      },
      {
        $match: prms,
      },
      {
        $sort: { dateTime: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit * 1,
      },
    ]);

    orders.forEach((item) => {
      item['restName'] = item.Restaurant[0].name;
      if (item.Restaurant[0].imageLink.length > 0) {
        item['restImage'] = item.Restaurant[0].imageLink[0];
      } else {
        item['restImage'] = '';
      }
      delete item.Restaurant;
    });

    return res.status(200).send({
      orders: orders,
      totalDocs: cnt,
      totalPages: Math.ceil(cnt / limit),
      currentPage: page,
    });
  } else {
    const prms = {
      resId: mongoose.Types.ObjectId(String(id)),
      status: orderStatus,
    };

    checkProperties(prms);
    const cOrd = await Order.find(prms);

    const cnt = cOrd.length;
    orders = await Order.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'custId',
          foreignField: '_id',
          as: 'Customer',
        },
      },
      {
        $match: prms,
      },
      {
        $sort: { dateTime: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit * 1,
      },
    ]);

    orders.forEach((item) => {
      item['custName'] = item.Customer[0].name;
      item['custImage'] = item.Customer[0].imageLink;

      delete item.Customer;
    });

    return res.status(200).send({
      orders: orders,
      totalDocs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  }
};

const getOrders = async (req, res) => {
  const { role, id } = req.headers;

  let orders;

  if (role === 'customer') {
    orders = await Order.aggregate([
      {
        $lookup: {
          from: 'restaurants',
          localField: 'resId',
          foreignField: '_id',
          as: 'Restaurant',
        },
      },
      {
        $match: { custId: mongoose.Types.ObjectId(String(id)) },
      },
      {
        $sort: { dateTime: -1}
      }
    ]);

    orders.forEach((item) => {
      item['restName'] = item.Restaurant[0].name;
      if (item.Restaurant[0].imageLink.length > 0) {
        item['restImage'] = item.Restaurant[0].imageLink[0];
      } else {
        item['restImage'] = '';
      }
      delete item.Restaurant;
    });

    return res.status(200).send(orders);
  } else {
    orders = await Order.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'custId',
          foreignField: '_id',
          as: 'Customer',
        },
      },
      {
        $match: { resId: mongoose.Types.ObjectId(String(id)) },
      },
      {
        $sort: { dateTime: -1}
      }
    ]);

    orders.forEach((item) => {
      item['custName'] = item.Customer[0].name;
      item['custImage'] = item.Customer[0].imageLink;

      delete item.Customer;
    });

    return res.status(200).send(orders);
  }
};

const getOrderById = async (req, res) => {
  console.log('bruhehehehe2222');

  const { role, id } = req.headers;
  const { oid } = req.params;

  let orderDetails = {};
  let dishName = [];

  try {
    if (role === 'restaurant') {
      orderDetails = await Order.aggregate([
        {
          $lookup: {
            from: 'customers',
            localField: 'custId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $lookup: {
            from: 'restaurants',
            localField: 'resId',
            foreignField: '_id',
            as: 'restaurant',
          },
        },
        {
          $match: {
            _id: mongoose.Types.ObjectId(String(oid)),
            resId: mongoose.Types.ObjectId(String(id)),
          },
        },
      ]);
      if (orderDetails) {
        orderDetails.forEach((item) => {
          item['custName'] = item.customer[0].name;
          item['deliveryType'] = item.restaurant[0].deliveryType;
          if (item.restaurant[0].imageLink.length > 0) {
            item['restImage'] = item.restaurant[0].imageLink[0];
          } else {
            item['restImage'] = '';
          }

          // const dishName = [];
          item.dishes.forEach((dish) => {
            const n = item.restaurant[0].dishes.filter(
              (ele) => String(ele._id) === String(dish.id),
            )[0].name;
            dishName.push(n);
          });
          delete item.restaurant;
          delete item.customer;
        });
        return res
          .status(200)
          .send({ orderDetails: orderDetails[0], dishName });
      }
      return res.status(404).send({ error: 'Restaurant Order Not found' });
    } else {
      orderDetails = await Order.aggregate([
        {
          $lookup: {
            from: 'restaurants',
            localField: 'resId',
            foreignField: '_id',
            as: 'restaurant',
          },
        },
        {
          $match: {
            _id: mongoose.Types.ObjectId(String(oid)),
            custId: mongoose.Types.ObjectId(String(id)),
          },
        },
      ]);
      if (orderDetails) {
        orderDetails.forEach((item) => {
          item['name'] = item.restaurant[0].name;
          item['deliveryType'] = item.restaurant[0].deliveryType;
          if (item.restaurant[0].imageLink.length > 0) {
            item['restImage'] = item.restaurant[0].imageLink[0];
          } else {
            item['restImage'] = '';
          }
          console.log(item);
          item.dishes.forEach((dish) => {
            const n = item.restaurant[0].dishes.filter(
              (ele) => String(ele._id) === String(dish.id),
            )[0].name;
            dishName.push(n);
          });
          delete item.restaurant;
        });
        return res
          .status(200)
          .send({ orderDetails: orderDetails[0], dishName });
      }
      return res.status(404).send({ error: 'Customer Order Not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err });
  }
};

module.exports = {
  createOrder,
  placeOrder,
  updateOrder,
  getOrders,
  getOrderById,
  filterOrders,
};
