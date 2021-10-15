/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  customers,
  orders,
  customer_address,
  fvrts,
  restaurants,
  restaurant_imgs,
  restaurant_dishtypes,
} = require("../models/data.model");

const createCustomer = async (req, res) => {
  try {
    // Get user input
    // eslint-disable-next-line object-curly-newline
    const { email, password, name, dob, city, state, country, nname, contact } =
      req.body;

    // Validate user input
    if (!(name && email && password)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldCust = await customers.findOne({
      where: {
        c_email: email,
      },
    });

    if (oldCust) {
      return res
        .status(409)
        .send({ error: "User Already Exist. Please Login" });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database---------------
    const customer = await customers.create({
      c_name: name,
      c_email: email, // sanitize: convert email to lowercase
      c_password: encryptedPassword,
      c_dob: dob,
      c_city: city,
      c_state: state,
      c_zipcode: req.body.zipcode,
      c_country: country,
      c_nick_name: nname,
      c_contact_no: contact,
    });

    // Create token
    const token = jwt.sign(
      { c_id: customer.c_id, email, role: "customer" },
      "UberEats",
      {
        expiresIn: "2h",
      }
    );
    // save customer token
    customer.token = token;
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(400).send(err);
  }
};

const customerLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) res.status(400).send("All input is required");

  const cust = await customers.findOne({
    where: {
      c_email: email,
    },
  });

  if (!cust) {
    res.status(409).send("User does not exist");
  } else {
    bcrypt.compare(password, cust.c_password, (err, result) => {
      if (err) {
        // handle error
        res.status(409).send("Error Verifying details!!!");
      }
      if (result) {
        // Send JWT
        const token = jwt.sign(
          { c_id: cust.c_id, email, role: "customer" },
          "UberEats",
          {
            expiresIn: "2h",
          }
        );
        cust.token = token;
        res.status(201).json({ token });
      } else {
        return res.json({ success: false, message: "passwords do not match" });
      }
    });
  }
};

const updateCustomer = async (req, res) => {
  const custID = req.headers.id;
  if (String(custID) !== String(req.params.cid))
    return res.status(401).send("Unauthorised");

  const {
    name,
    email,
    about,
    profile_img,
    dob,
    city,
    state,
    country,
    nname,
    contact,
  } = req.body;

  const cust = await customers.findOne({
    where: {
      c_id: custID,
    },
  });

  if (email && email !== cust.c_email) {
    const checkCust = await customers.findOne({
      where: {
        c_email: email,
      },
    });

    if (checkCust) {
      return res.status(403).send({error: "Customer already exist with given email"});
    }
  }

  try {
    await cust.update(
      {
        c_name: name,
        c_email: email,
        c_about: about,
        c_profile_img: profile_img,
        c_dob: dob,
        c_city: city,
        c_state: state,
        c_country: country,
        c_nick_name: nname,
        c_contact_no: contact,
      },
      {
        returning: true,
      }
    );
    return res.status(201).send({message: "Customer Updated"});
  } catch (err) {
    return res.status(404).send(err);
  }
};

const addAddress = async (req, res) => {
  try {
    const custId = req.headers.id;
    const { role } = req.headers;
    const { address, zipcode } = req.body;

    if (!custId || role === "restaurant") {
      return res.status(401).send({ error: "Unauthorised Access" });
    }
    if (role === "customer") {
      const findExistAddress = await customer_address.findOne({
        where: {
          c_id: custId,
          ca_address_line: address,
          ca_zipcode: zipcode,
        },
      });

      if (findExistAddress) {
        return res.status(409).send({ error: "Address Already Exists" });
      }
      await customer_address.create({
        ca_address_line: address,
        ca_zipcode: zipcode,
        c_id: custId,
      });
    }
    res.status(201).send({ msg: "Address Added" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAddress = async (req, res) => {
  const custId = req.headers.id;

  try {
    const custAddr = await customer_address.findAll({
      where: {
        c_id: custId,
      },
    });

    if (custAddr.length === 0 || !custAddr) {
      return res.staus(404).send({ error: "No Addresses Found" });
    }
    return res.status(201).send(custAddr);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteCustomer = async (req, res) => {
  const custID = req.params.cid;
  if (!custID) return res.status(404).send("Need Customer ID");

  const cust = await customers.findOne({
    where: {
      c_id: custID,
    },
  });

  if (!cust) return res.status(403).send("Customer does not exist");
  try {
    cust.destroy();
    return res.status(201).send("Customer deleted");
  } catch (err) {
    return res.status(404).send(err);
  }
};

const getCustomerProfile = async (req, res) => {
  const custId = req.headers.id;
  const cust = await customers.findOne({
    where: {
      c_id: custId,
    },
    attributes: { exclude: ["c_password", "createdAt", "updatedAt"] },
  });

  console.log(cust);
  if (!cust) {
    return res.status(404).send("Customer does not exists");
  }
  return res.status(201).send(cust);
};

const getCustomerById = async (req, res) => {
  const cust = await customers.findOne({
    where: {
      c_id: req.params.cid,
    },
    attributes: { exclude: ["c_password", "createdAt", "updatedAt"] },
  });
  if (!cust) {
    return res.status(404).send("Customer does not exists");
  }
  return res.status(201).send(cust);
};

const getAllCustomers = async (req, res) => {
  const rid = req.headers.id;

  const custs = await orders.findAll({
    attributes: ["c_id"],
    include: [
      {
        model: customers,
      },
    ],
    where: {
      r_id: rid,
    },
  });
  return res.status(201).send(custs);
};

const addToFavorites = async (req, res) => {
  const custId = req.headers.id;
  const restId = req.body.rid;
  if (!custId) {
    return res.status(404).send({ error: "Customer Id Not FOund" });
  }

  try {
    const findRest = await restaurants.findOne({
      where: {
        r_id: restId,
      },
    });

    if (!findRest) {
      return res.status(404).send({ error: "Restaurant do not exist" });
    }

    const existingFvrt = await fvrts.findOne({
      where: {
        c_id: custId,
        r_id: restId,
      },
    });

    if (existingFvrt) {
      return res
        .status(201)
        .send({ message: "Restaurant is already added to fvrts" });
    }
    const addFavorite = await fvrts.create({
      r_id: restId,
      c_id: custId,
    });
  } catch (err) {
    return res.status(500).send(err);
  }

  return res.status(200).send({ message: "Added to Favorites" });
};

const deleteFromFavorites = async (req, res) => {
  const custId = req.headers.id;
  const restId = req.params.rid;
  if (!custId) {
    return res.status(404).send({ error: "Customer Id Not FOund" });
  }

  try {
    await fvrts.destroy({
      r_id: restId,
      c_id: custId,
    });
  } catch (err) {
    return res.status(500).send(err);
  }

  return res.status(200).send({ message: "Removed from Favorites" });
};

const getAllFavorites = async (req, res) => {
  const custId = req.headers.id;
  if (!custId) {
    return res.status(404).send({ error: "Customer Id Not Found" });
  }

  try {
    const custFvrts = await fvrts.findAll({
      include: [{model: restaurants, include: [restaurant_imgs, restaurant_dishtypes]}],
      where:{
        c_id: custId,
      },
    });

    return res.status(200).send(custFvrts);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  createCustomer,
  customerLogin,
  updateCustomer,
  deleteCustomer,
  getCustomerProfile,
  getCustomerById,
  getAllCustomers,
  addAddress,
  getAddress,
  addToFavorites,
  deleteFromFavorites,
  getAllFavorites,
};
