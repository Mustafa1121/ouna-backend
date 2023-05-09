const router = require("express").Router();
const controller = require("../../controller/Product/ProductOperation");

// AUTH Middleware
const isAuth = require("../../middleware/User/isAuthMiddleware");
const isVerified = require("../../middleware/User/isVerifiedMiddleware");

router.get("/:origin?", controller.getAllProducts);
// GET (ALL PRODUCTS)
router.get("/", controller.getAllProducts);
// GET (SINGLE PRODUCT)
router.get("/:id", controller.getSingleProduct);
// POST (ADD PRODUCT)
router.post("/addProduct", isVerified, isAuth, controller.addProduct);
router.get("/category/:id", controller.getProductsByCategory);

module.exports = router;
