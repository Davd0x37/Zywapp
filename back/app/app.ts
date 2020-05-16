require("dotenv").config();

import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import { start, fatal } from "signale";
import { igniteConnection } from "./connect";
import routes from "./routes";

(async () => {
  try {
    await igniteConnection();

    const PORT = 5000;
    const app = express();

    app
      .use(
        cors({
          origin: "*",
        }),
      )
      .use(bodyparser());

    app.use("/", routes);

    app.listen(PORT);

    start(`🚀 Server ready at port ${PORT}`);
  } catch (err) {
    fatal(err);
  }
})();
