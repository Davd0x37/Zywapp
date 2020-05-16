import express from "express";
import { User, Meals, PhysicalActivity, Daily, HistoricData } from "@/entity";
const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const users = await User.find();
    const meals = await Meals.find();
    const activites = await PhysicalActivity.find();
    const daily = await Daily.find();
    res.send({
      users,
      meals,
      activites,
      daily,
    });
  }
});

router.post("/add_daily", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = req.body;
  if (token) {
    await Daily.create({ name: data.name }).save();
  }
});

router.post("/remove", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = req.body;
  if (token) {
    switch (data.type) {
      case "user": {
        const user = await User.findOneOrFail({
          where: {
            id: data.id,
          },
        });
        await user.remove();
        break;
      }
      case "meal": {
        const historic = await HistoricData.find({
          where: {
            meals: {
              id: data.id,
            },
          },
        });
        for await (const h of historic) {
          await h.remove();
        }

        const meal = await Meals.findOneOrFail({
          where: {
            id: data.id,
          },
        });
        await meal.remove();
        break;
      }
      case "activity": {
        const activity = await PhysicalActivity.findOneOrFail({
          where: {
            id: data.id,
          },
        });
        await activity.remove();
        break;
      }
      case "daily": {
        const daily = await Daily.findOneOrFail({
          where: {
            id: data.id,
          },
        });
        await daily.remove();
        break;
      }
      default: {
        break;
      }
    }
  }
});

router.post("/toggle_admin", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = req.body;
  if (token) {
    const user = await User.findOneOrFail({
      where: {
        id: data.userId,
      },
    });
    await User.update(
      { id: data.userId },
      {
        isAdmin: user.isAdmin ? false : true,
      },
    );
  }
});
router.post("/toggle_plan", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = req.body;
  if (token) {
    const user = await User.findOneOrFail({
      where: {
        id: data.userId,
      },
    });
    await User.update(
      { id: data.userId },
      {
        accountType: user.accountType === "premium" ? "free" : "premium",
      },
    );
  }
});

export default router;
