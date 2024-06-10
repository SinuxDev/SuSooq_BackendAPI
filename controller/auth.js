const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();

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
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;
  try {
    // Check if email exists
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      throw new Error("Email doesn't exists");
    }

    //Check if password is match
    const isMatch = bcrypt.compareSync(password, userDoc.password);

    if (!isMatch) {
      throw new Error("Wrong User Credentials");
    }

    //Create JWT Token
    const token = JWT.sign({ userId: userDoc._id }, process.env.JWT_TOKEN_KEY, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      token,
      isSuccess: true,
      message: "User Login Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

exports.checkUserToken = async (req, res, next) => {
  try {
    const userDoc = await User.findById(req.userId).select("name email role");
    if (!userDoc) {
      throw new Error("Unauthorized");
    }

    return res.status(200).json({
      isSuccess: true,
      message: "User is authorized",
      userDoc,
    });
  } catch (error) {
    return res.status(401).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
