const Product = require("../models/Product");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: "approved" }).sort({
      createdAt: -1,
    });

    if (!products) {
      return res.status(404).json({
        isSuccess: false,
        message: "Products not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
