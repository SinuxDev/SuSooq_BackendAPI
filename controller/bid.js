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
