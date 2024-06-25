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

exports.filterProducts = async (req, res, next) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery || typeof searchQuery !== "string") {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid Search Query",
      });
    }

    const products = await Product.find({
      status: "approved",
      $and: [{ name: { $regex: searchQuery, $options: "i" } }],
    }).sort({ createdAt: -1 });

    if (!products || products.length <= 0) {
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
