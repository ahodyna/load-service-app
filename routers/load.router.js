const router = require("express").Router();
const authMiddlewares = require("../middlewares/auth.middlewares");
const userMiddlewares = require("../middlewares/user.middlewares");
const loadController = require("../controllers/load.controller");

router.post("/", authMiddlewares.checkAccessToken, userMiddlewares.isShipper, loadController.createLoad);

router.get("/", authMiddlewares.checkAccessToken, loadController.getAllLoads);

router.get("/active", authMiddlewares.checkAccessToken, userMiddlewares.isDriver, loadController.getActiveLoad);

router.patch("/active/state", authMiddlewares.checkAccessToken, userMiddlewares.isDriver, loadController.changeDeliveryStatus)

router.get("/:id", authMiddlewares.checkAccessToken, loadController.getLoadById);

router.delete("/:id", authMiddlewares.checkAccessToken, userMiddlewares.isShipper, loadController.deleteLoadById);

router.put("/:id", authMiddlewares.checkAccessToken, userMiddlewares.isShipper, loadController.updateLoadInfo);

router.post("/:id/post", authMiddlewares.checkAccessToken, userMiddlewares.isShipper,  loadController.findTruck)



module.exports = router;