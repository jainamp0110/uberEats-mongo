/* eslint-disable consistent-return */
/* eslint-disable newline-per-chained-call */
const { body, validationResult, check } = require('express-validator');

const customerValidationRules = () => [
  body('email').optional({ nullable: true }).isEmail().withMessage('Enter Valid Email'),
  body('password').optional({ nullable: true }).isString().withMessage('Enter Valid Password'),
  body('name').optional({ nullable: true }).isString().withMessage('Enter Valid Email'),
  // body('dob').optional({ nullable: true }).isDate().withMessage({error:'Enter Valid Date'}),
  body('city').optional({ nullable: true }).isString().withMessage('Enter Valid City Name'),
  body('state').optional({ nullable: true }).isString().withMessage('Enter Valid State'),
  body('country').optional({ nullable: true }).isString().withMessage('Enter Valid Country'),
  check('nickName').optional({ nullable: true }).isString(),
  body('contactNum')
    .optional({ nullable: true })
    .isString()
    .custom((val) => {
      const regex = new RegExp('^([0-9]){10}$');
      const match = regex.test(val);
      if (match) {
        return Promise.resolve(val);
      }
      return Promise.reject(new Error('Enter Valid Phone Number'));
    })
    .withMessage({error: 'Enter Valid Contact Number'}),
];

const restaurantValidationRules = () => [
  body('email').optional({ nullable: true }).isEmail().withMessage('Enter Valid Email'),
  body('password').optional({ nullable: true }).isString().withMessage('Enter Valid Password'),
  body('name').optional({ nullable: true }).isString().withMessage('Enter Valid Email'),
  body('address')
    .optional({ nullable: true })
    .isString()
    .withMessage('Enter Valid Address Line'),
  body('city').optional({ nullable: true }).isString().withMessage('Enter Valid City Name'),
  body('state').optional({ nullable: true }).isString().withMessage('Enter Valid State'),
  body('zipcode').optional({ nullable: true }).isNumeric().withMessage('Enter Valid Zipcode'),
  body('deliveryType').optional({ nullable: true }).isString().withMessage('Enter Valid Delivery Type'),
  body('imageLink').optional({ nullable: true }).isString().withMessage('Enter Valid Image Link'),
  body('contactNum')
    .optional({ nullable: true })
    .isString()
    .custom((val) => {
      const regex = new RegExp('^([0-9]){10}$');
      const match = regex.test(val);
      if (match) {
        return Promise.resolve(val);
      }
      return Promise.reject(new Error('Enter Valid Phone Number'));
    })
    .withMessage('Enter Valid Contact Number'),
];

const dishDetailsValidator = () => [
  body('name').optional({ nullable: true }).isString().withMessage('Enter Valid Dish Name'),
  body('ingredients')
    .optional({ nullable: true })
    .isString()
    .withMessage('Enter Valid Ingredient Details'),
  body('price').optional({ nullable: true }).isFloat().withMessage('Enter Valid Price'),
  body('desc').optional({ nullable: true }).isString().withMessage('Enter Valid Description'),
  body('category').optional({ nullable: true }).isString().withMessage('Enter Valid Category'),
  body('type').optional({ nullable: true }).isString().withMessage('Enter Valid Type'),
];

const validator = async (req, res, next) => {
  const err = validationResult(req);
  const errors = [];
  err.array().forEach((ele) => {
    errors.push({ [ele.param]: ele.msg });
  });
  if (!err.isEmpty()) {
    return res.status(400).send(err);
  }
  next();
};

module.exports = {
  customerValidationRules,
  dishDetailsValidator,
  validator,
  restaurantValidationRules,
};
