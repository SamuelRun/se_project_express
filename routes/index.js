const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/users", clothingItem);

module.exports = router;
