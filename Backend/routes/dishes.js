/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
const express = require('express');
const { createDish, updateDish, deleteDish, getDishById, getAllDishes, insertDishImage, deleteDishImage } = require('../controllers/dish');
const { dishDetailsValidator, validator } = require('../controllers/validator');

const router = express.Router();

router.post('/newdish', dishDetailsValidator(), validator, createDish);

router.put('/:did', dishDetailsValidator(), validator, updateDish);

router.delete('/:did', deleteDish);

router.get('/:did', getDishById);

router.post('/images/:did', insertDishImage);

router.delete('/images/:imgId', deleteDishImage);


router.get('/', getAllDishes);
module.exports = router;
