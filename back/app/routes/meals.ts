import express from "express";
import { User, Meals } from "@/entity";
import { Like } from "typeorm";
const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  // const auth = await User.authenticate(login, password);
  const onlyMe = req.body.onlyMe;
  const title = req.body.title;

  if (onlyMe && token) {
    const meals = await Meals.getByUserId(token, title);
    if (meals && meals?.length > 0) {
      res.send(JSON.stringify(meals));
    } else {
      res.send(JSON.stringify([]));
    }
  } else {
    let meals = [];
    if (title) {
      meals = await Meals.find({
        where: {
          name: Like(`%${title}%`),
        },
      });
    } else {
      meals = await Meals.find();
    }
    if (meals.length > 0) {
      res.send(JSON.stringify(meals));
    } else {
      res.send(JSON.stringify([]));
    }
  }
});

router.post("/add", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { data } = req.body;
  if (token) {
    const mealId = await Meals.addMeal(token, data);
    if (mealId) {
      res.send(JSON.stringify(mealId));
    }
  }
});

router.post("/remove", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { mealId } = req.body;
  if (token) {
    await Meals.removeMeal(mealId);
  }
});

export default router;
