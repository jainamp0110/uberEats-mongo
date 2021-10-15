/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const {
  dishes,
  dish_imgs,
  sequelize,
  restaurants,
} = require("../models/data.model");

const createDish = async (req, res) => {
  try {
    const { name, ingredients, price, desc, category, type, imgs } = req.body;
    const restID = req.headers.id;

    if (!(name && price && category && type)) {
      return res.status(403).send("Provide all Details");
    }

    const existingDish = await dishes.findOne({
      where: {
        r_id: restID,
        d_name: name,
      },
    });

    const t = await sequelize.transaction();
    try {
      if (!existingDish) {
        const dish = await dishes.create(
          {
            d_name: name,
            d_ingredients: ingredients,
            d_price: price,
            d_desc: desc,
            d_category: category,
            d_type: type,
            r_id: restID,
          },
          { transaction: t }
        );

        if (imgs) {
          const dishImages = imgs.map((ele) => ({
            d_id: dish.d_id,
            di_img: ele,
            di_alt_text: "Dish Image",
          }));

          await dish_imgs.bulkCreate(dishImages, {
            transaction: t,
          });
        }
        t.commit();

        const dishDetails = await dishes.findOne({
          where: {
            d_id: dish.d_id,
          },
          include: [
            {
              model: dish_imgs,
            },
          ],
        });

        res.status(201).json({ dishDetails });
      } else {
        res.status(403).send({ error: "Dish Already Exist" });
      }
    } catch (err) {
      t.rollback();
      res.status(404).send(err);
    }
  } catch (err) {
    res.status(404).send(err);
  }
};

const updateDish = async (req, res) => {
  const { name, ingredients, price, desc, category, type, imgs } = req.body;
  const dishId = req.params.did;
  const restId = req.headers.id;

  if (!dishId) return res.status(403).send("Provide all Details");
  const existDish = await dishes.findOne({
    where: {
      d_id: dishId,
      r_id: restId,
    },
  });

  if (!existDish) return res.status(404).send("Dish Does not exist!!");

  if (name !== existDish.d_name) {
    const findDishName = await dishes.findOne({
      where: {
        d_name: name,
        r_id: restId,
      },
    });

    if (findDishName) return res.status(403).send("Dish with same name Exist");
  }

  try {
    existDish.update(
      {
        d_name: name,
        d_ingredients: ingredients,
        d_price: price,
        d_desc: desc,
        d_category: category,
        d_type: type,
      },
      {
        returning: true,
      }
    );
    res.status(201).send("Dish Updated!!");
  } catch (err) {
    return res.status(404).send(err);
  }

  if (imgs) {
    try {
      await dish_imgs.destroy({
        where: {
          d_id: dishId,
        },
      });
      const dishImages = imgs.map((ele) => ({
        d_id: dishId,
        di_img: ele,
        di_alt_text: "Dish Image",
      }));
      await dish_imgs.bulkCreate(dishImages);
    } catch (err) {
      res.status(404).send("Unable to update Dish Images");
    }
  }
};

const deleteDish = async (req, res) => {
  const dishId = req.params.did;
  if (!dishId) return res.status(404).send("Dish Does not Exist");

  const restId = req.headers.id;
  const findDish = await dishes.findOne({
    where: {
      r_id: restId,
      d_id: dishId,
    },
  });

  console.log(findDish);

  try {
    if (findDish) {
      await findDish.destroy({
        where: {
          d_id: dishId,
        },
      });
      return res.status(201).send({ message: "Dish Deleted" });
    }
    return res.status(404).send({ error: "Dish Not Found" });
  } catch (err) {
    return res.status(404).send(err);
  }
};

const getDishById = async (req, res) => {
  const dishId = req.params.did;
  const restId = req.headers.id;

  const dish = await dishes.findOne({
    include: dish_imgs,
    where: { d_id: dishId, r_id: restId },
  });

  if (!dish) return res.status(404).send("Dish not found");
  return res.status(201).send(dish);
};

const getAllDishes = async (req, res) => {
  const rid = req.headers.id;
  const dishDetails = await dishes.findAll({
    include: dish_imgs,
    where: {
      r_id: rid,
    },
  });
  if (dishDetails.lenght === 0) {
    return res.status(404).send({ error: "No Dishes Found" });
  }
  return res.status(201).send(dishDetails);
};

const insertDishImage = async (req, res) => {
  const restId = req.headers.id;
  const dishId = req.params.did;
  const imageLink = req.body.img;

  if (!dishId) return res.status(403).send("Provide all Details");
  const existDish = await dishes.findOne({
    where: {
      d_id: dishId,
      r_id: restId,
    },
  });

  if (!existDish) return res.status(404).send("Dish Does not exist!!");

  await dish_imgs.create({
    di_img: imageLink,
    di_alt_text: "Dish image",
    d_id: dishId,
  });

  return res.status(201).send({ message: "Dish image Added" });
};

const deleteDishImage = async (req, res) => {
  const restId = req.headers.id;
  const dishImageId = req.params.imgId;

  const existDishImage = await dish_imgs.findOne({
    where: {
      di_id: dishImageId,
    },
  });

  if (!existDishImage) return res.status(404).send("Dish Does not exist!!");

  await dish_imgs.destroy({
    where: {
      di_id: dishImageId,
    },
  });
  return res.status(201).send({ message: "Dish image Deleted" });
};

module.exports = {
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  getAllDishes,
  insertDishImage,
  deleteDishImage,
};
