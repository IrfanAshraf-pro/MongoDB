const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const AllowCorsMiddlewares=require("./src/middlewares/AllowCorsMiddlewares")

dotenv.config();

app.use(express.json({ limit: "25mb" }));
app.use(AllowCorsMiddlewares)
const port = process.env.PORT;
const DB = process.env.DB;

require("./src/Routes/Auth/Auth",AllowCorsMiddlewares)(app);
mongoose.connect(DB);
mongoose.connection.on("connected", () => {
  console.log("Connected to DB");
});
mongoose.connection.on("error", (err) => {
  console.log("connection error", err);
});
app.listen(port, () => {
  console.log(` app listening on port ${port} `);
});
