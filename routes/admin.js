const { Router } = require("express");
const router = Router();

const adminController = require("../controller/admin");
const adminMiddleware = require("../middleware/isAdmin");
const authMiddleware = require("../middleware/auth");

// Get All Products GET -> /admin/products
router.get(
  "/products",
  authMiddleware,
  adminMiddleware,
  adminController.getAllProducts
);

module.exports = router;
