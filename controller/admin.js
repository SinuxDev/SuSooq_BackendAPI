const Product = require("../models/Product");
const User = require("../models/user");

exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  try {
    const productDoc = await Product.find()
      .populate("seller", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (!productDoc.length) {
      return res.status(404).json({
        isSuccess: false,
        message: "Products not found",
      });
    }

    const totalProducts = await Product.countDocuments();

    const pendingProducts = await Product.countDocuments({ status: "pending" });

    const totalPriceAggregation = await Product.aggregate([
      {
        $addFields: {
          priceNumeric: { $toDouble: "$price" },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$priceNumeric" },
        },
      },
    ]);

    const totalPrice =
      totalPriceAggregation.length > 0
        ? totalPriceAggregation[0].totalPrice
        : 0;

    const totalPages = Math.ceil(totalProducts / perPage);

    return res.status(200).json({
      isSuccess: true,
      products: productDoc,
      totalPages,
      totalProducts,
      currentPage: page,
      totalPrice,
      pendingProducts,
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

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const userDoc = await User.find()
      .select("name email role createdAt status")
      .sort({ createdAt: -1 });

    if (!userDoc) {
      return res.status(404).json({
        isSuccess: false,
        message: "Users not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      userDocs: userDoc,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

const updateUserStatus = async (req, res, status) => {
  const { id } = req.params;

  try {
    const userDoc = await User.findById(id);

    if (!userDoc) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }

    userDoc.status = status;
    await userDoc.save();

    return res.status(200).json({
      isSuccess: true,
      message: `User was ${status} successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.BanUser = (req, res) => updateUserStatus(req, res, "banned");

exports.UnbanUser = (req, res) => updateUserStatus(req, res, "active");
