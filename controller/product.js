const { validationResult } = require("express-validator");

//Models
const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      isSuccess: false,
      message: errors.array()[0].msg,
    });
  }

  const {
    product_name,
    product_category,
    product_description,
    product_price,
    product_used_for,
    product_status,
  } = req.body;

  try {
    const productDoc = await Product.create({
      name: product_name,
      description: product_description,
      category: product_category,
      price: product_price,
      usedFor: product_used_for,
      status_details: product_status,
      seller: req.userId,
    });

    return res.status(201).json({
      isSuccess: true,
      message: "Product Added To Sell List",
      productDoc,
    });
  } catch (err) {
    return res.status(422).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
