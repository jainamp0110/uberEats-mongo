/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */

const {
  orders,
  carts,
  dishes,
  order_dishes,
  sequelize,
  dish_imgs,
  restaurants,
  restaurant_imgs,
  customers,
} = require("../models/data.model");

const createOrder = async (req, res) => {
  const custId = req.headers.id;
  const cartDetails = await carts.findAll({
    attributes: ["d_id", "r_id"],
    where: {
      c_id: custId,
    },
  });

  if (cartDetails.length === 0) {
    return res.status(404).send("No Items in Cart");
  }

  let dishIds = [];

  cartDetails.forEach((element) => {
    dishIds.push(element.d_id);
  });
  const dishPriceDetails = await dishes.findAll({
    attributes: ["d_id", "d_price"],
    where: {
      d_id: dishIds,
    },
  });

  let sum = 0;
  dishIds.forEach((element) => {
    dishPriceDetails.forEach((ele) => {
      if (element === ele.d_id) {
        sum += ele.d_price;
      }
    });
  });

  const restId = cartDetails[0].r_id;

  const t = await sequelize.transaction();
  try {
    const initOrder = await orders.create(
      {
        o_status: "Initialized",
        o_total_price: sum,
        c_id: custId,
        r_id: restId,
        o_tax: sum * 0.18,
        o_final_price: sum + sum * 0.18,
      },
      { transaction: t }
    );

    if (dishIds) {
      const listDishes = dishIds.map((ele) => ({
        o_id: initOrder.o_id,
        d_id: ele,
      }));

      await order_dishes.bulkCreate(listDishes, {
        transaction: t,
      });

      await carts.destroy({
        where: {
          c_id: custId,
        },
        transaction: t,
      });

      await orders;
      await t.commit();
      return res.status(201).send({
        orderId: initOrder.o_id,
        message: "Order Initialised Successfully",
      });
    }
  } catch (err) {
    await t.rollback();
    return res.status(400).send(err);
  }
};

const placeOrder = async (req, res) => {
  const { type, address, id } = req.body;
  try {
    const updateOrder = await orders.update(
      {
        o_status: "Placed",
        o_type: type,
        o_address: address,
        o_date_time: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      {
        where: {
          o_id: id,
        },
      }
    );
    // Checking if Update was successfull or not
    if (updateOrder[0] !== 1) {
      return res.status(404).send("Order Not found");
    }
    return res.status(201).send("Order Placed");
  } catch (err) {
    return res.status(400).send(err);
  }
};

const updateOrder = async (req, res) => {
  const { status } = req.body;
  const { oid } = req.params;
  try {
    const updateStatus = await orders.update(
      {
        o_status: status,
      },
      {
        where: {
          o_id: oid,
        },
      }
    ); // Checking if Update was successfull or not
    if (updateStatus[0] !== 1) {
      console.log("HERERERE IN order");
      return res.status(404).send({ error: "Order Not found" });
    }
    return res.status(201).send({ message: "Order Status Updated" });
  } catch (err) {
    console.log("Error IN order");

    return res.status(404).send(err);
  }
};

const filterOrders = async (req, res) => {
  const restId = req.headers.id;
  if (!restId) return res.status(403).send({ error: "Unauthorised Action" });

  const { orderStatus } = req.query;
  try {
    const filteredOrders = await orders.findAll({
      include: [
        { model: customers, exclude: ["c_password", "createdAt", "updatedAt"] },
        {
          model: restaurants,
          include: restaurant_imgs,
          exclude: ["r_password", "createdAt", "updatedAt"],
        },
        {
          model: order_dishes,
          include: dishes,
          exclude: ["createdAt", "updatedAt"],
        },
      ],
      where: {
        r_id: restId,
        o_status: orderStatus,
      },
    });
    return res.status(200).send(filteredOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Error Fetching Record" });
  }
};

const getOrders = async (req, res) => {
  const { role } = req.headers;

  let getorders;
  if (role === "customer") {
    getorders = await orders.findAll({
      include: [
        { model: customers, exclude: ["c_password", "createdAt", "updatedAt"] },
        {
          model: restaurants,
          include: restaurant_imgs,
          exclude: ["r_password", "createdAt", "updatedAt"],
        },
        {
          model: order_dishes,
          include: dishes,
          exclude: ["createdAt", "updatedAt"],
        },
      ],
      where: {
        c_id: req.headers.id,
      },
      order: [["createdAt", "DESC"]],
    });
  } else if (role === "restaurant") {
    getorders = await orders.findAll({
      include: [
        { model: customers, exclude: ["c_password", "createdAt", "updatedAt"] },
        {
          model: restaurants,
          include: restaurant_imgs,
          exclude: ["r_password", "createdAt", "updatedAt"],
        },
        {
          model: order_dishes,
          include: dishes,
          exclude: ["createdAt", "updatedAt"],
        },
      ],
      where: {
        r_id: req.headers.id,
      },
    });
  }
  return res.status(201).send(getorders);
};

const getOrderById = async (req, res) => {
  const { role } = req.headers;
  const { oid } = req.params;
  const { id } = req.headers;

  if (role === "restaurant") {
    const findRestOrder = await orders.findOne({
      include: [
        { model: order_dishes, include: dishes },
        {
          model: restaurants,
          attributes: { exclude: ["r_password", "createdAt", "updatedAt"] },
        },
      ],
      where: {
        o_id: oid,
        r_id: id,
      },
      exclude: ["r_password", "createdAt", "updatedAt"],
    });

    if (findRestOrder) {
      return res.status(200).send(findRestOrder);
    }

    return res.status(404).send({ error: "Restuarant Order Not Found" });
  }

  const findCustOrder = await orders.findOne({
    include: [
      { model: order_dishes, include: dishes },
      {
        model: restaurants,
        include: restaurant_imgs,
        attributes: { exclude: ["r_password", "createdAt", "updatedAt"] },
      },
    ],
    where: {
      o_id: oid,
      c_id: id,
    },
  });

  if (findCustOrder) {
    return res.status(201).send(findCustOrder);
  }

  return res.status(404).send({ error: "Customer Order Not Found" });
};
module.exports = {
  createOrder,
  placeOrder,
  updateOrder,
  getOrders,
  getOrderById,
  filterOrders,
};
