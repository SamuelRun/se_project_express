const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", updateCurrentUser);

module.exports = router;
