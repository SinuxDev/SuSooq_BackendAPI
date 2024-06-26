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

// Get single product GET -> GetProduct (Get single product)
router.get("/product/:id", authMiddleware, productController.getOldProduct);

// Update product PUT -> UpdateProduct (Update product)
router.put(
  "/update-product",
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
  productController.updateProducts
);

// Delete product DELETE -> DeleteProduct (Delete product)
router.delete(
  "/delete-product/:id",
  authMiddleware,
  productController.deleteProduct
);

// Upload product images POST -> UploadProductImages (Upload product images)
router.post(
  "/upload-images",
  authMiddleware,
  productController.uploadProductImages
);

// Get product images GET -> GetProductImages (Get product images)
router.get(
  "/product-images/:id",
  authMiddleware,
  productController.getProductImages
);

// Delete product image DELETE -> DeleteProductImage (Delete product image)
// product/images/destroy/:productId/:imgToDelete
router.delete(
  "/product/images/destroy/:productId/:imgToDelete",
  authMiddleware,
  productController.deleteProductImages
);

// Save product POST -> SaveProduct (Save product)
router.post(
  "/save-products/:id",
  authMiddleware,
  productController.saveProduct
);

// Show Save product GET -> ShowSaveProduct (Show save product)
router.get("/save-products", authMiddleware, productController.showSaveProduct);

module.exports = router;
