const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.put("/:itemId", updateItem);
router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
