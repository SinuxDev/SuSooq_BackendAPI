const { Schema, model } = require("mongoose");

const savedProductSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("SavedProducts", savedProductSchema);
