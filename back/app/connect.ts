import { createConnection } from "typeorm";
import entities from "@/entity";
import { subscribers } from "@/subscribers";

export const igniteConnection = async () => {
  const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT, NODE_ENV } = process.env;
  const isDev = NODE_ENV === "development";

  return createConnection({
    name: "default",
    type: "postgres",
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    synchronize: true,
    logging: false,
    // dropSchema: isDev,
    entities,
    subscribers,
  });
};
