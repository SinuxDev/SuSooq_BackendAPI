const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;

//Models
const Product = require("../models/Product");
const SavedProduct = require("../models/SavedProduct");

exports.createProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      isSuccess: false,
      message: errors.array()[0].msg,
    });
  }

  const {
    product_name,
    product_category,
    product_description,
    product_price,
    product_used_for,
    product_status,
  } = req.body;

  try {
    const productDoc = await Product.create({
      name: product_name,
      description: product_description,
      category: product_category,
      price: product_price,
      usedFor: product_used_for,
      status_details: product_status,
      seller: req.userId,
    });

    return res.status(201).json({
      isSuccess: true,
      message: "Product Added To Sell List",
      productDoc,
    });
  } catch (err) {
    return res.status(422).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      isSuccess: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

exports.getOldProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    return res.status(200).json({
      isSuccess: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

exports.updateProducts = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        isSuccess: false,
        message: errors.array()[0].msg,
      });
    }

    const {
      product_name,
      product_category,
      product_description,
      product_price,
      product_used_for,
      product_status,
      seller_id,
      product_id,
    } = req.body;

    if (req.userId.toString() !== seller_id.toString()) {
      throw new Error("Unauthorized");
    }

    const product = await Product.findOne({ _id: product_id });
    product.name = product_name;
    product.description = product_description;
    product.category = product_category;
    product.price = product_price;
    product.usedFor = product_used_for;
    product.status_details = product_status;
    product.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Product Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

// Delete product DELETE -> DeleteProduct (Delete product)
exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const productDoc = await Product.findOne({ _id: id });

    if (!productDoc) {
      throw new Error("Product not found");
    }

    if (req.userId.toString() !== productDoc.seller.toString()) {
      throw new Error("Unauthorized");
    }

    // Delete images from cloudinary server
    if (productDoc.images && Array.isArray(productDoc.images)) {
      const destroyPromise = productDoc.images.map((image) => {
        const img_id = image.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(img_id);
      });

      try {
        await Promise.all(destroyPromise);
      } catch (err) {
        throw new Error("Error deleting images");
      }
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      isSuccess: true,
      message: "Product Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

// Upload product images
exports.uploadProductImages = async (req, res, next) => {
  const productImages = req.files;
  const product_id = req.body.product_id;
  let secureURLarray = [];

  try {
    if (!productImages) {
      throw new Error("Please upload images");
    }

    productImages.forEach(async (image) => {
      await cloudinary.uploader.upload(image.path, async (err, result) => {
        if (err) {
          throw new Error("Error uploading image");
        }

        const secureUrl = result.secure_url;
        secureURLarray.push(secureUrl);

        if (productImages.length === secureURLarray.length) {
          await Product.findByIdAndUpdate(product_id, {
            $push: { images: secureURLarray },
          });

          return res.status(200).json({
            isSuccess: true,
            message: "Images Uploaded Successfully",
            secureURLarray,
          });
        }
      });
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

// Get Product Images (Saved Images)
exports.getProductImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productDoc = await Product.findById(id).select("images");

    if (!productDoc) {
      throw new Error("Product not found");
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Images fetched successfully",
      SavedImages: productDoc,
    });
  } catch (err) {
    return res.status(404).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

exports.deleteProductImages = async (req, res, next) => {
  const product_id = req.params.productId;
  const decodedImg = decodeURIComponent(req.params.imgToDelete);

  const public_id = decodedImg.split("/").pop().split(".")[0];

  try {
    await Product.findByIdAndUpdate(product_id, {
      $pull: { images: decodedImg },
    });

    await cloudinary.uploader.destroy(public_id);

    return res.status(200).json({
      isSuccess: true,
      message: "Image Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

exports.saveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await SavedProduct.create({
      user_id: req.userId,
      product_id: id,
    });

    if (!product) {
      throw new Error("Error saving product");
    }

    return res.status(201).json({
      isSuccess: true,
      message: "Product saved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

exports.showSaveProduct = async (req, res, next) => {
  try {
    const savedProducts = await SavedProduct.find({
      user_id: req.userId,
    }).populate("product_id", "name description category price images");

    if (!savedProducts || savedProducts.length === 0) {
      throw new Error("No saved products found");
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Saved products fetched successfully",
      savedProducts,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

exports.unSaveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await SavedProduct.findOneAndDelete({
      user_id: req.userId,
      product_id: id,
    });

    if (!product) {
      throw new Error("Error unsaving product");
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Product unsaved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
