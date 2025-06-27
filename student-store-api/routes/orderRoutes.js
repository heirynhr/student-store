const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController.js");

// -> /orders
router.get("/", controller.getAll);
// orders/:id
router.get("/:id", controller.getById);
// create orginal order once checkout is clicked
router.post("/", controller.create);
// order update 
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);


// THIS IS FOR IF ORDER IS PLACED THEN ADD THEN ITEM INTO IT
router.post("/:id/items", controller.createOrderItems);
router.get("/:id/total", controller.getOrderTotal);

module.exports = router;