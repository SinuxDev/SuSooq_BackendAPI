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

// Approve Product POST -> /admin/products/approve/:id
router.post(
  "/products/approve/:id",
  authMiddleware,
  adminMiddleware,
  adminController.ApproveProduct
);

// Reject Product POST -> /admin/products/reject/:id
router.post(
  "/products/reject/:id",
  authMiddleware,
  adminMiddleware,
  adminController.RejectProduct
);

module.exports = router;
