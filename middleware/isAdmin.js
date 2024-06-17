const User = require("../models/user");

const isAdmin = async (req, res, next) => {
  const UNAUTHORIZED_MESSAGE = "Unauthorized Admin Access";

  try {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({
        isSuccess: false,
        message: UNAUTHORIZED_MESSAGE,
      });
    }

    const userDoc = await User.findById(userId).select("role");

    if (!userDoc || userDoc.role !== "admin") {
      return res.status(401).json({
        isSuccess: false,
        message: UNAUTHORIZED_MESSAGE,
      });
    }

    req.userId = userId;
    next();
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = isAdmin;
