const Bid = require("../models/Bid");

exports.saveNewBid = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id, comment, phone_num } = req.body;

    const newBid = await Bid.create({
      product_id,
      seller_id,
      buyer_id,
      comment,
      phone_num,
    });

    if (!newBid) {
      return res.status(400).json({
        isSuccess: false,
        message: "Failed to add bid",
      });
    }

    return res.status(201).json({
      isSuccess: true,
      message: "Bid added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};

// Get all bids by product ID
exports.getBidByProductId = async (req, res) => {
  const { product_id } = req.params;
  try {
    const bids = await Bid.find({ product_id })
      .populate("buyer_id", "name email")
      .select("comment phone_num createdAt")
      .sort({ createdAt: -1 });

    if (!bids || bids.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Failed to fetch bids",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Bids fetched successfully",
      bids,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};
