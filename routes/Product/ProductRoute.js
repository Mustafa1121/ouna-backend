const router = require("express").Router();
const controller = require("../../controller/Product/ProductOperation");

// AUTH Middleware
const isAuth = require("../../middleware/User/isAuthMiddleware");
const isVerified = require("../../middleware/User/isVerifiedMiddleware");


// GET (SINGLE PRODUCT)
router.get("/:id", controller.getSingleProduct);
// GET (ALL PRODUCTS)
router.get("/all/:origin?", controller.getAllProducts);
// POST (ADD PRODUCT)
router.post("/addProduct", isVerified, isAuth, controller.addProduct);
router.get("/category/:id", controller.getProductsByCategory);

module.exports = router;
