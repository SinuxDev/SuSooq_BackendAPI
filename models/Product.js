const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    usedFor: {
      type: String,
      required: true,
    },
    status_details: {
      type: Array,
      default: null,
    },
    images: {
      type: [String],
    },
    status: {
      type: String,
      default: "pending",
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Products", productSchema);
