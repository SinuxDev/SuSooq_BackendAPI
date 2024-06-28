const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    message: {
      required: true,
      type: String,
    },
    product_id: {
      required: true,
      type: String,
    },
    seller_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    phone_number: {
      required: true,
      type: String,
    },
    isRead: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Notifications", NotificationSchema);
