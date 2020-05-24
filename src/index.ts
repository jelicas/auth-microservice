import "dotenv/config";

import express from "express";
import { createConnection } from "typeorm";

const PORT = process.env.PORT;

createConnection()
  .then(() => {
    const app = express();

    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
