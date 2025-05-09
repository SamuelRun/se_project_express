const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.use((req, res) =>
  res.status(NotFoundError.statusCode).json({ message: "Item not found" })
);

module.exports = router;
