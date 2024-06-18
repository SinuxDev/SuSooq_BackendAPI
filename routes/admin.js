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

// Rollback Product POST -> /admin/products/rollback/:id
router.post(
  "/products/rollback/:id",
  authMiddleware,
  adminMiddleware,
  adminController.RollbackProduct
);

// Get All Users GET -> /admin/users
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  adminController.getAllUsers
);

// Ban User POST -> /admin/users/ban/:id
router.post(
  "/users/ban/:id",
  authMiddleware,
  adminMiddleware,
  adminController.BanUser
);

// Unban User POST -> /admin/users/unban/:id
router.post(
  "/users/unban/:id",
  authMiddleware,
  adminMiddleware,
  adminController.UnbanUser
);

module.exports = router;
