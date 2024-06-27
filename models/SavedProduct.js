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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a unique index on the combination of user_id and product_id
savedProductSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = model("SavedProducts", savedProductSchema);
