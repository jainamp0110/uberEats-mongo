const mongoose = require('mongoose');
const Order = require('../../models/order.models');

const checkProperties = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      delete obj[key];
    }
  });
};

const handle_request = async (msg, callback) => {
  try {
    const { body, id } = msg;
    const updObj = {
      status: 'Placed',
      orderType: body.orderType,
      addressId: body.addressId,
      dateTime: new Date().toString(),
    };
    if (body.notes) {
      updObj.notes = body.notes;
    }

    checkProperties(updObj);

    const updateOrder = await Order.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      {
        $set: updObj,
      },
    );

    if (!updateOrder) {
      callback(
        {
          isError: true,
          errorStatus: 404,
          error: 'Order not found!',
        },
        null,
      );
      return;
    }
    callback(null, { message: 'Order placed!' });
  } catch (err) {
    console.log(err);
    callback(
      {
        isError: true,
        errorStatus: 400,
        error: err,
      },
      null,
    );
  }
};

module.exports = handle_request;
