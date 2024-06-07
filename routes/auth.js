const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controller/auth");

// Register new user POST -> Register
router.post(
  "/register",
  [
    body("name").trim().not().notEmpty().withMessage("Name is required"),
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
    body("password")
      .trim()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
  ],
  authController.login
);

module.exports = router;
