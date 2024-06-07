const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// Register new user
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array()[0],
    });
  }

  try {
    // Check if user-email already exists
    const userDoc = await User.findOne({ email });

    if (userDoc) {
      throw new Error("User already exists");
    }

    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      isSuccess: true,
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(409).json({
      isSuccess: false,
      message: errors.array()[0],
    });
  }
};

exports.login = (req, res, next) => {};
