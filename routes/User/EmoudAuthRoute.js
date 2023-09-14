const router = require("express").Router();
const controller = require("../../controller/User/EmoudAuth");
// AUTH Middleware
// const isAuth = require("../../middleware/User/isEmoudMiddleware");

// POST (LOGIN)
router.post("/login", controller.login);
router.post("/register", controller.register);

module.exports = router;
