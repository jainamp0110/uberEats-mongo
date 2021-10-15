/* eslint-disable camelcase */
const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
});

const restaurants = sequelize.define('restaurants', {
  r_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  r_email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  r_password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  r_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  r_address_line: {
    type: Sequelize.TEXT,
  },
  r_city: {
    type: Sequelize.STRING,
  },
  r_state: {
    type: Sequelize.STRING,
  },
  r_zipcode: {
    type: Sequelize.INTEGER,
  },
  r_desc: {
    type: Sequelize.TEXT,
  },
  r_contact_no: {
    type: Sequelize.STRING,
  },
  r_delivery_type: {
    type: Sequelize.ENUM,
    values: ['Delivery', 'Pickup', 'Both'],
  },
  r_start: {
    type: Sequelize.TIME,
  },
  r_end: {
    type: Sequelize.TIME,
  },
});

const restaurant_dishtypes = sequelize.define('restaurant_dishtypes', {
  rdt_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rdt_type: {
    type: Sequelize.ENUM,
    values: ['Veg', 'Non-Veg', 'Vegan'],
    allowNull: false,
  },
});

restaurants.hasMany(restaurant_dishtypes, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

restaurant_dishtypes.belongsTo(restaurants, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});
const customers = sequelize.define('customers', {
  c_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  c_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  c_email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  c_password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  c_about: {
    type: Sequelize.TEXT,
  },
  c_profile_img: {
    type: Sequelize.STRING,
  },
  c_dob: {
    type: Sequelize.DATEONLY,
  },
  c_city: {
    type: Sequelize.STRING,
  },
  c_state: {
    type: Sequelize.STRING,
  },
  c_country: {
    type: Sequelize.STRING,
  },
  c_nick_name: {
    type: Sequelize.STRING,
  },
  c_contact_no: {
    type: Sequelize.STRING,
  },
});

const dishes = sequelize.define('dishes', {
  d_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  d_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  d_ingredients: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  d_price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  d_desc: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  d_category: {
    type: Sequelize.ENUM,
    values: ['Appetizer', 'Salads', 'Main Course', 'Desserts', 'Beverages'],
    allowNull: false,
  },
  d_type: {
    type: Sequelize.ENUM,
    values: ['Veg', 'Non-Veg', 'Vegan'],
  },
});

restaurants.hasMany(dishes, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

dishes.belongsTo(restaurants, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});
const orders = sequelize.define('orders', {
  o_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  o_status: {
    type: Sequelize.ENUM,
    values: [
      'Initialized',
      'Placed',
      'Preparing',
      'Ready',
      'Picked Up',
      'On the Way',
      'Delivered',
      'Cancelled',
    ],
    allowNull: false,
  },
  o_type: {
    type: Sequelize.ENUM,
    values: ['Pickup', 'Delivery'],
  },
  o_total_price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  o_tax: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  o_final_price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  o_date_time: {
    type: Sequelize.DATE,
  },
  o_address: {
    type: Sequelize.TEXT,
  },
});

const order_dishes = sequelize.define('order_dishes', {
  od_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});



orders.hasMany(order_dishes, {
  foreignKey: 'o_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  allowNull: false,
});

order_dishes.belongsTo(orders, {
  foreignKey: 'o_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

dishes.hasMany(order_dishes, {
  foreignKey: 'd_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  allowNull: false,
});

order_dishes.belongsTo(dishes, {
  foreignKey: 'd_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  allowNull: false,
});

const fvrts = sequelize.define('fvrts', {
  f_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

customers.hasMany(fvrts, {
  foreignKey: 'c_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

fvrts.belongsTo(customers, {
  foreignKey: 'c_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

restaurants.hasMany(fvrts, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

fvrts.belongsTo(restaurants, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

customers.hasMany(orders, {
  foreignKey: 'c_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

orders.belongsTo(customers, {
  foreignKey: 'c_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

restaurants.hasMany(orders, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

orders.belongsTo(restaurants, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

const customer_address = sequelize.define('customer_address', {
  ca_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  ca_address_line: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  ca_zipcode: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

customers.hasMany(customer_address, {
  foreignKey: 'c_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

customer_address.belongsTo(customers, {
  foreignKey: 'c_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

const carts = sequelize.define('carts', {
  cart_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

customers.hasMany(carts, {
  foreignKey: 'c_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

carts.belongsTo(customers, {
  foreignKey: 'c_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

dishes.hasMany(carts, {
  foreignKey: 'd_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

carts.belongsTo(dishes, {
  foreignKey: 'd_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

restaurants.hasMany(carts, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

carts.belongsTo(restaurants, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});
const restaurant_imgs = sequelize.define('restaurant_imgs', {
  ri_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  ri_img: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ri_alt_text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

restaurants.hasMany(restaurant_imgs, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

restaurant_imgs.belongsTo(restaurants, {
  foreignKey: 'r_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});
const dish_imgs = sequelize.define('dish_imgs', {
  di_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  di_img: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  di_alt_text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

dishes.hasMany(dish_imgs, {
  foreignKey: 'd_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

dish_imgs.belongsTo(dishes, {
  foreignKey: 'd_id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});
module.exports = {
  sequelize,
  restaurants,
  customers,
  customer_address,
  orders,
  order_dishes,
  carts,
  restaurant_imgs,
  dish_imgs,
  fvrts,
  dishes,
  restaurant_dishtypes,
};
