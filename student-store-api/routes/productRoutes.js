const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

// -> /products
router.get("/", controller.getAll);
// products/:id
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;