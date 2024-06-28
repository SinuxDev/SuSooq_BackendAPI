const { Schema, model } = require("mongoose");

const bidSchema = new Schema(
  {
    product_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
    seller_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    buyer_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    phone_num: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Bids", bidSchema);
