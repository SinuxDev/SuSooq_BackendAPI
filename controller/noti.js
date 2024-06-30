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

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        isSuccess: false,
        message: "Notification id is required",
      });
    }

    const notification = await Notification.findById(id);

    if (req.userId.toString() !== notification.seller_id.toString()) {
      return res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
    }

    if (!notification) {
      return res.status(400).json({
        isSuccess: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        isSuccess: false,
        message: "Notification id is required",
      });
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(400).json({
        isSuccess: false,
        message: "Notification not found",
      });
    }

    if (req.userId.toString() !== notification.seller_id.toString()) {
      return res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Notification deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    const notification = await Notification.findById(req.userId);

    if (!notification) {
      return res.status(400).json({
        isSuccess: false,
        message: "No notifications found",
      });
    }

    if (req.userId.toString() !== notification.seller_id.toString()) {
      return res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
    }

    await Notification.deleteMany({ seller_id: req.userId });

    return res.status(200).json({
      isSuccess: true,
      message: "All notifications deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};
