const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

router.get("/", authMiddlewares.checkAccessToken, userController.getUserById);

router.delete("/", authMiddlewares.checkAccessToken, userController.deleteUserById);

router.patch("/", authMiddlewares.checkAccessToken, userController.updateUser);

module.exports = router;