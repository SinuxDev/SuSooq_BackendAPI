const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const productDoc = await Product.find()
      .populate("seller", "name")
      .sort({ createdAt: -1 });

    if (!productDoc) {
      return res.status(404).json({
        isSuccess: false,
        message: "Products not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      products: productDoc,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};
