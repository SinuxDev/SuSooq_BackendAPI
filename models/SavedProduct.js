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

// Issue#1 fixed : Added unique index on user_id and product_id combination to prevent duplicate entries
// MongoDB Client Index Creation Command: db.savedproducts.createIndex({user_id: 1, product_id: 1}, {unique: true})
// MongoDb Client : db.savedproducts.aggregate([{$group: {_id: {user_id: "$user_id", product_id: "$product_id"}, count: {$sum: 1}}}, {$match: {count: {$gt: 1}}}])

module.exports = model("SavedProducts", savedProductSchema);
