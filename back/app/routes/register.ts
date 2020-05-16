import express from "express";
import { User, Reminders } from "@/entity";
import { hash } from "@/components/hash";
const router = express.Router();

router.post("/", async (req, res) => {
  const { login, password, email } = req.body;
  const hashPass = await hash(password);
  const user = await User.create({
    email,
    login,
    password: hashPass,
    registerDate: new Date(),
  }).save();
  const reminders = await Reminders.create({
    user,
  }).save();
  res.send(user);
});

export default router;
