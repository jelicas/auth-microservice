import "dotenv/config";

import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';

import { createConnection } from "typeorm";

import { authRoutes } from "./routes/authRoutes";

const PORT = process.env.PORT;

createConnection()
  .then(() => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(cookieParser());

    app.use("/auth", authRoutes);

    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
