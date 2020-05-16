import express from "express";
import login from "./login";
import register from "./register";
import me from "./me";
import reminder from "./reminder";
import progress from "./progress";
import meals from "./meals";
import historic from "./historic";
import physical from "./physical";
import admin from "./admin";

const router = express.Router();

// Home page route.
router.get("/", async (req, res) => {
  res.send("hello from home");
});

// About page route.
router.use("/login", login);
router.use("/register", register);
router.use("/me", me);
router.use("/reminders", reminder);
router.use("/progress", progress);
router.use("/meals", meals);
router.use("/historic", historic);
router.use("/physical", physical);
router.use("/admin", admin);

export default router;
