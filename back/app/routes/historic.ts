import express from "express";
import { User, Meals, HistoricData } from "@/entity";
const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const title = req.body.title;
  const date = req.body.date;

  if (token) {
    const historicData = await HistoricData.getByUserIdDate(token, {
      date,
    });
    // @ts-ignore
    const ids = historicData?.flatMap((val) => val.hd_mealsId);
    if (ids && ids.length > 0) {
      const meals = [];
      for (const id of ids) {
        const meal = await Meals.getByMealsId(id, title);
        meals.push(meal);
      }
      if (meals && meals?.length > 0) {
        res.send(meals);
      } else {
        res.send([]);
      }
    } else {
      res.send([]);
    }
  }
});

router.post("/add", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { mealId, userId, date } = req.body;
  if (token) {
    await HistoricData.addData(mealId, userId, date);
  }
});

router.post("/remove", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { mealId, userId } = req.body;
  if (token) {
    const req = await HistoricData.removeData(mealId, userId);
  }
});

export default router;
