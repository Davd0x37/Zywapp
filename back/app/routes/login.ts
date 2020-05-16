import express from "express";
import { User } from "@/entity";
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { login, password } = req.body;
  const auth = await User.authenticate(login, password);
  if (auth) {
    res.send(
      JSON.stringify({
        data: {
          token: auth.id,
        },
      }),
    );
  } else {
    next("Nie ma takiego użytkownika");
  }
});

export default router;
