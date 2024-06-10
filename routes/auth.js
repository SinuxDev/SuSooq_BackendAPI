const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controller/auth");

const authMiddleware = require("../middleware/auth");

// Register new user POST -> Register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .not()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("password")
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
  ],
  authController.register
);

// Login user POST -> Login
router.post(
  "/login",
  [
    body("password").trim().notEmpty(),
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
  ],
  authController.login
);

// Check if token is valid GET -> CheckToken
router.get("/checkUserToken", authMiddleware, authController.checkUserToken);

module.exports = router;
