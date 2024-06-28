const Notification = require("../models/Notification");

exports.pushNotification = async (req, res) => {
  try {
    const { title, message, product_id, seller_id, phone_number } = req.body;

    const newNotification = await Notification.create({
      title,
      message,
      product_id,
      seller_id,
      phone_number,
    });

    if (!newNotification) {
      return res.status(400).json({
        isSuccess: false,
        message: "Failed to add notification",
      });
    }

    return res.status(201).json({
      isSuccess: true,
      message: "Notification added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      seller_id: req.userId,
    }).sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "No notifications found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "New notifications found",
      notifications,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};
