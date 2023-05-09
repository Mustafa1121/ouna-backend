const router = require("express").Router();
const controller = require("../../controller/Cart/CartOperation");
// AUTH Middleware
const isAuth = require("../../middleware/User/isAuthMiddleware");

router.get("/cart/items", isAuth, controller.getCartItems);
router.post("/cart/:itemId", isAuth, controller.addToCart);
router.delete("/cart/:itemId", isAuth, controller.deleteFromCart);
router.delete("/cart", isAuth, controller.clearCart);

module.exports = router;
