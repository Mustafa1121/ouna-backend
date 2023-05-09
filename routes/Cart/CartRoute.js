const router = require("express").Router();
const controller = require("../../controller/Cart/CartOperation");
// AUTH Middleware
const isAuth = require("../../middleware/User/isAuthMiddleware");
const isVerified = require("../../middleware/User/isVerifiedMiddleware");

router.get("/cart/items", isAuth, isVerified, controller.getCartItems);
router.post("/cart/:itemId", isAuth, isVerified, controller.addToCart);
router.delete("/cart/:itemId", isAuth, isVerified, controller.deleteFromCart);
router.delete("/cart", isAuth, isVerified, controller.clearCart);

module.exports = router;
