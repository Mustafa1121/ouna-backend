const Product = require("../../models/Product/ProductModel");
const User = require("../../models/User/UserModel");
const cloudinary = require("cloudinary").v2;
const classifyImages = require("../../helpers/googleVision");

// helpers
const getUnitPrice = require("../../helpers/getUnitPrice").getUnitPrice;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.addProduct = async (req, res) => {
  try {
    const data = req.body;
    let images = Array.isArray(data.imagesbase)
    ? data.imagesbase
    : data.imagesbase.split('IMAGE_BASE');
    const video = data.base64Video;
    let imagesArray = [];
    const newProduct = new Product({
      name: data.name,
      price: data.price,
      category: data.category,
      owner: req.user._id,
      description: data.description,
      recycling: data.recycling,
      rating: data.rating,
      origin: data.origin,
      location: data.location,
      unitPrice: getUnitPrice(data.origin),
    });

    if (
      await require("../../helpers/googleVision").performLabelDetection(images)
    ) {
      if (images) {
        for (let j = 0; j < images.length; j++) {
          const url = await cloudinary.uploader.upload(images[j], {
            folder: "products_folder",
            resource_type: "image",
          });
          imagesArray.push({ url: url.secure_url });
          newProduct.images = imagesArray;
        }
      }
      if (video) {
        const video1 = await cloudinary.uploader.upload(video, {
          resource_type: "video",
          folder: "Video_folder",
        });
        newProduct.video = { url: video1.secure_url };
      }
      await newProduct.save();
      return res
        .status(200)
        .json({ message: "Product accepted", data: newProduct });
    } else {
      return res.status(400).json({ message: "Rejected by Ai" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Product.findById(id).populate("video");
    console.log(item);
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found! Please try again later" });
    } else {
      return res.status(200).json({ message: "Item found", item });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { origin } = req.params;
    let products;
    if (origin) {
      products = await Product.find({ origin: origin }).populate("category");
    } else {
      products = await Product.find({ origin: "Lebanon" }).populate("category");
    }
    return res.status(200).json({ products });
  } catch (error) {
    console.log(error);
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { id, origin } = req.params; //the category id
  try {
    const products = await Product.find({ category: id, origin: origin });
    return res.status(200).json({ products });
  } catch (error) {
    console.log(error);
  }
};

// IMPORTANT
exports.deleteOldProducts = async (req, res) => {
  try {
    // Get all products that are more than 30 days old
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    const oldProducts = await Product.find({
      createdAt: { $lt: thirtyDaysAgo },
    });

    // Delete each old product and send an email to the owner
    for (const product of oldProducts) {
      const ownerId = product.owner;
      await product.remove();

      // Send an email to the owner of the deleted product
      const owner = await User.findById(ownerId);
      if (owner) {
        const subject = "Product Deletion Notification";
        const message = `Dear ${owner.Fname},\n\nYour product "${product.name}" has been deleted because it was more than 30 days old.\n\nBest regards,\nThe Admin Team`;
        await sendEmail(owner.email, subject, message);
      }
    }

    return res.status(200).json({
      message:
        "Old products have been deleted and notifications sent to their owners",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
