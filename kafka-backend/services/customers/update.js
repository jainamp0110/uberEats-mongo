const mongoose = require('mongoose');
const Customer = require('../../models/customer.models');

const handle_request = async (msg, callback) => {
  try {
    const { body, id, cid } = msg;
    if (String(id) !== String(cid)) {
      callback(
        {
          isError: true,
          errorStatus: 401,
          error: 'Unauthorised!',
        },
        null,
      );
      return;
    }

    const cust = await Customer.findOne({
      _id: mongoose.Types.ObjectId(String(cid)),
    });

    if (body.email && body.email !== cust.email) {
      const checkCust = await Customer.findOne({
        email: body.email,
      });

      if (checkCust) {
        callback(
          {
            isError: true,
            errorStatus: 403,
            error: 'Customer already exist with given email!',
          },
          null,
        );
        return;
      }
    }
    await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(cid)),
      },
      {
        $set: body,
      },
    );
    callback(null, { message: 'Customer Updated!' });
  } catch (err) {
    callback(
      {
        isError: true,
        errorStatus: 500,
        error: 'Server error!',
      },
      null,
    );
  }
};

module.exports = handle_request;
