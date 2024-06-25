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
    const { searchQuery, category } = req.query;

    let query = {};

    if (searchQuery) {
      if (
        (searchQuery === "searchQuery" && !searchQuery) ||
        searchQuery === "" ||
        searchQuery !== String(searchQuery)
      )
        return res.status(400).json({
          isSuccess: false,
          message: "Search query is required",
        });

      query = {
        status: "approved",
        $and: [{ name: { $regex: searchQuery, $options: "i" } }],
      };
    }

    if (category) {
      query = {
        status: "approved",
        category,
      };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

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

exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "email name"
    );

    if (!product) {
      return res.status(404).json({
        isSuccess: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
