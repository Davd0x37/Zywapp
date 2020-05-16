import express from "express";
import { User, PhysicalActivity } from "@/entity";
const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const { title } = req.body;
    const user = await User.findOneOrFail(token);
    const activity = await PhysicalActivity.getByTitle(title);
    res.send(
      JSON.stringify({
        activity,
      }),
    );
  }
});

router.post("/add", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const { title, about } = req.body;
    await PhysicalActivity.create({
      title,
      about,
    }).save();
  }
});

export default router;
