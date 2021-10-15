/* eslint-disable prefer-const */
const express = require('express');
const cors = require('cors');

const app = express();

let corsOptions = {
  origin: 'http://localhost:8081',
};

// app.use(cors(corsOptions));

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const { getAccessMiddleware } = require('u-server-utils');

const { sequelize } = require('./models/data.model');

// sequelize.sync({ alter: true });
sequelize.sync();

const authRouter = require('./routes/auth');
const { validateToken } = require('./config/validateToken');
const restaurant = require('./routes/restuarant');
const dishes = require('./routes/dishes');
const customers = require('./routes/customers');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const accessControl = require('./controllers/accessController');

app.use('/auth', authRouter);

app.use(validateToken);
// app.use(getAccessMiddleware(accessControl));

app.use('/restaurant', restaurant);
app.use('/dishes', dishes);
app.use('/customers', customers);
app.use('/cart', cart);
app.use('/orders', orders);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
