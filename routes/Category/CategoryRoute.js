const router = require("express").Router();
const controller = require("../../controller/Category/CategoryOperation");

router.get("/", controller.getAllCategories);

module.exports = router;
