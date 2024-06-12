const express = require("express");
const mongooes = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

// Global Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// Routes
app.use(authRoutes);
app.use(productRoutes);

mongooes
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
