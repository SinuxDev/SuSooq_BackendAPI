const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const productController = require("../controller/product");
const authMiddleware = require("../middleware/auth");

// Create new product POST -> CreateProduct (Add product)
router.post(
  "/create-product",
  authMiddleware,
  [
    body("product_name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("product_category")
      .trim()
      .notEmpty()
      .withMessage("Category is required"),
    body("product_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),
    body("product_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be a number"),
    body("product_used_for")
      .trim()
      .notEmpty()
      .withMessage("Used for is required"),
    body("product_status")
      .isArray()
      .optional()
      .withMessage("Status details must be an array"),
  ],
  productController.createProduct
);

// Get all products GET -> GetProducts (Get all products)

router.get("/products/", authMiddleware, productController.getAllProducts);

module.exports = router;
