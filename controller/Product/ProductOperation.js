const Product = require("../../models/Product/ProductModel");
const cloudinary = require("cloudinary").v2;

// helpers
const getUnitPrice = require("../../helpers/getUnitPrice").getUnitPrice;

console.log(process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.addProduct = async (req, res) => {
  try {
    const data = req.body;
    const images = data.imagesbase;
    const video = data.video64base;
    let imagesArray = [];
    const newProduct = new Product({
      name: data.name,
      price: data.price,
      category: data.category,
      owner: req.user._id,
      description: data.description,
      recycling: data.recycling,
      origin: data.origin,
      unitPrice: getUnitPrice(data.origin),
    });
    if (images) {
      for (let j = 0; j < images.length; j++) {
        console.log(images[j]);
        const url = await cloudinary.uploader.upload(images[j], {
          folder: "products_folder",
          resource_type: "image",
        });
        imagesArray.push({ url: url.secure_url });
        newProduct.images = imagesArray;
      }
    }
    if (video) {
      const video = await cloudinary.uploader.upload(video, {
        resource_type: "video",
        folder: "Video_folder",
      });
      newProduct.video = { url: video.secure_url };
    }
    console.log(newProduct);
    await newProduct.save();
    return res
      .status(200)
      .json({ message: "Product added to be analyzed", data: newProduct });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Product.findById(id);
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
    const { origin } = req.body;
    const products = await Product.find({ origin: origin });
    return res.status(200).json({ message: "All products", products });
  } catch (error) {
    console.log(error);
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { id } = req.params; //the category id
  try {
    const products = await Product.find({ category: id });
    return res.status(200).json({ message: "Category", products });
  } catch (error) {
    console.log(error);
  }
};