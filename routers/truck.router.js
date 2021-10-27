const router = require("express").Router();
const authMiddlewares = require("../middlewares/auth.middlewares");
const userMiddlewares = require("../middlewares/user.middlewares");
const truckController = require("../controllers/truck.controller");

router.post("/", authMiddlewares.checkAccessToken, userMiddlewares.isDriver, truckController.createTruck);

router.get("/", authMiddlewares.checkAccessToken, userMiddlewares.isDriver, truckController.getAllTrucks);

router.get("/:id", authMiddlewares.checkAccessToken, userMiddlewares.isDriver, truckController.getTruckById);

router.delete("/:id", authMiddlewares.checkAccessToken, userMiddlewares.isDriver, truckController.deleteTruckById);

router.put("/:id", authMiddlewares.checkAccessToken, userMiddlewares.isDriver, truckController.updateTruckInfo);

router.post("/:id/assign", authMiddlewares.checkAccessToken, userMiddlewares.isDriver, truckController.assignTruck);


module.exports = router;