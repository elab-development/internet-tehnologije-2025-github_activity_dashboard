import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import appEntities from "../entities";

dotenv.config();

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: appEntities,
  synchronize: true,
  ssl: process.env.DB_SSL === "true",
  extra: {
    ssl: {
      rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED === "true",
    },
  },
});

