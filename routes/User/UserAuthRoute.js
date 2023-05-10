const router = require("express").Router();
const controller = require("../../controller/User/UserAuth");
// AUTH Middleware
const isAuth = require("../../middleware/User/isAuthMiddleware");
const isVerified = require("../../middleware/User/isVerifiedMiddleware");

// POST (LOGIN)
router.post("/login", controller.login);
// POST (REGISTER)
router.post("/register", controller.register);
// POST (FORGOT PASSWORD)
router.post("/forgot-password", controller.forgotPassword);
// POST (FORGOT PASSWORD) WITH TOKEN
router.post("/reset-password/:token", controller.resetPassword);
// POST (VERIFY PASSWORD)
router.post("/verify-email", controller.verifyEmail);
// POST (VERIFY PASSWORD) WITH TOKEN
router.get("/verify-email/:token", controller.verifyEmailToken);
// POST (CHANGE PASSWORD)
router.post("/change-password", isAuth, isVerified, controller.changePassword);

module.exports = router;
