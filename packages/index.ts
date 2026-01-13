
import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import { dataSource } from "./database/data-src";

dotenv.config();

const port = process.env.PORT || 3999;

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

dataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Auth Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });




