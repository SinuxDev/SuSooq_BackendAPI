const express = require("express");
const mongooes = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();

//Routes Path
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

// Multer Config
const storageConfig = multer.diskStorage({
  filename: (req, file, cb) => {
    const surfix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, surfix + "-" + file.originalname);
  },
});

const filterConfig = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};

// Global Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: storageConfig, fileFilter: filterConfig }).array(
    "product_images"
  )
);

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
