const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const { NotFoundError } = require("../utils/errors");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", auth, userRouter);
router.get("/items", clothingItem);
router.use("/items", auth, clothingItem);

router.use((req, res) =>
  res.status(NotFoundError.statusCode).json({ message: "Item not found" })
);

module.exports = router;
