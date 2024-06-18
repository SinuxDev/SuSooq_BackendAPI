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

const updateProductStatus = async (req, res, status) => {
  const { id } = req.params;
  try {
    const productDoc = await Product.findById(id);

    if (!productDoc) {
      return res.status(404).json({
        isSuccess: false,
        message: "Product not found",
      });
    }

    productDoc.status = status;
    await productDoc.save();

    let message;
    switch (status) {
      case "approved":
        message = "Product approved successfully";
        break;
      case "rejected":
        message = "Product rejected successfully";
        break;
      case "pending":
        message = "Product status rolled back successfully";
        break;
      default:
        message = "Product status updated successfully";
    }

    return res.status(200).json({
      isSuccess: true,
      message,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.ApproveProduct = (req, res) =>
  updateProductStatus(req, res, "approved");

exports.RejectProduct = (req, res) => updateProductStatus(req, res, "rejected");

exports.RollbackProduct = (req, res) =>
  updateProductStatus(req, res, "pending");
