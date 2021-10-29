const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const { sequelize } = require('./models/data.model');

sequelize.sync();

const authRouter = require('./routes/auth');
const { validateToken } = require('./config/validateToken');
const restaurant = require('./routes/restaurant.routes');
const dishes = require('./routes/dish.routes');
const customers = require('./routes/customer.routes');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const accessControl = require('./controllers/accessController');

const expressSwagger = require('express-swagger-generator')(app);

const mongoose = require('mongoose');

const options = {
  swaggerDefinition: {
    info: {
      description: 'Uber Eats using Mongo Database',
      title: 'Uber Eats',
      version: '1.0.0',
    },
    host: 'localhost:8080',
    basePath: '/',
    produces: ['application/json'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/**/*.js'], //Path to the API handle folder
};

expressSwagger(options);

app.use('/auth', authRouter);
app.use(validateToken);

app.use('/restaurants', restaurant);
app.use('/dishes', dishes);
app.use('/customers', customers);
app.use('/cart', cart);
app.use('/orders', orders);

const impFunc = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:admin@cluster0.jmcs4.mongodb.net/uberEats?retryWrites=true&w=majority`, {
        useNewUrlParser: 'true',
        autoIndex: true,
      }
    );

    const PORT = 8080;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.log(`Unable to start Server`);
  }
};

impFunc();