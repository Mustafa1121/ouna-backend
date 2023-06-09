const router = require("express").Router();
const controller = require("../../controller/Product/ProductOperation");

// AUTH Middleware
const isAuth = require("../../middleware/User/isAuthMiddleware");
const isVerified = require("../../middleware/User/isVerifiedMiddleware");

// GET (ALL PRODUCTS)
router.get("/all/:origin?", controller.getAllProducts);
// GET (SINGLE PRODUCT)
router.get("/:id", controller.getSingleProduct);

// POST (ADD PRODUCT)
router.post("/addProduct", isVerified, isAuth, controller.addProduct);
router.get("/category/:id/:origin", controller.getProductsByCategory);

module.exports = router;
