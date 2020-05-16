import express from "express";
import { User, Daily, Reminders } from "@/entity";
const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const user = await User.findOneOrFail(token);
    res.send(
      JSON.stringify({
        token: user.id,
        data: user,
      }),
    );
  }
});

router.post("/update", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = req.body;
  if (token) {
    const update = await User.updateAbout(token, data);
    if (update) {
      res.send(update);
    }
  }
});

router.post("/update_limits", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = req.body;
  if (token) {
    const update = await User.updateLimits(token, data);
    if (update) {
      res.send(update);
    }
  }
});

router.post("/daily", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = req.body;
  if (token) {
    const update = await User.updateDaily(token, !data.wykonane);
    if (update) {
      res.send(update);
    }
  }
});

router.get("/get_daily", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const daily = await Daily.findOne();
    if (daily) {
      res.send(daily);
    }
  }
});

router.get("/get_reminders", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const user = await User.findOneOrFail(token);
    const daily = await Reminders.findOne(user.reminders.id);
    if (daily) {
      res.send(daily);
    }
  }
});

router.post("/premium", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    await User.upgradeToPremium(token);
  }
});

export default router;
