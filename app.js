const express = require("express");
const mongooes = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

// Cloudinary
const cloudinary = require("cloudinary").v2;

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

// Cloudinary Config
async function configureCloudinary() {
  //Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

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

(async function startServer() {
  try {
    await configureCloudinary();
    console.log("Cloudinary configured successfully");

    await mongooes.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");

    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  } catch (err) {
    console.log("Error in start server : ", err);
    process.exit(1);
  }
})();
