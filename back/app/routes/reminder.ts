import express from "express";
import { User, Reminders } from "@/entity";
const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const { fluids, microIngredients, hours, challenges, exercises } = req.body;
    await Reminders.updateReminders(token, {
      fluids,
      microIngredients,
      hours,
      challenges,
      exercises,
    });
    res.sendStatus(200);
  }
});

export default router;
