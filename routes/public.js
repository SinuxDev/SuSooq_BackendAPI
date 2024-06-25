const express = require("express");
const router = express.Router();

const publicController = require("../controller/public");

// Get All Products => /api/products => GET
router.get("/products", publicController.getAllProducts);

// Filter Products => /api/products/filters => GET
router.get("/products/filters", publicController.filterProducts);

module.exports = router;
