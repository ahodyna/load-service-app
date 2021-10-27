const { Load, Truck } = require("../dataBase");
const ErrorHandler = require("../errors/ErrorHandler");
const mongoose = require("mongoose");

const { truckService } = require('../services')


function isPositiveNumber(number) {
    return number !== undefined
        && number !== ""
        && !isNaN(Number(number))
        && Number(number) >= 0
}

function isValidMongoId(id) {
    try {
        new mongoose.Types.ObjectId(id);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    createLoad: async (req, res, next) => {
        try {
            const load = req.body;
            load.createdBy = req.loggedUser._id;

            const foundLoad = await Load.findOne({ "name": load.name, "payload": load.payload });

            if (foundLoad) {
                throw new ErrorHandler(400, "Load already exists");
            }

            let createdItem = await Load.create({
                createdBy: load.createdBy,
                dimensions: {
                    width: load.dimensions.width,
                    length: load.dimensions.length,
                    height: load.dimensions.height
                },
                name: load.name,
                payload: load.payload,
                pickup_address: load.pickup_address,
                delivery_address: load.delivery_address
            });

            let truck = await Truck.find({ status: "IS" })

            for (let i = 0; i < truck.length; i++) {
                if (truck[i].assigned_to !== null) {

                    let truckSize = truckService.chooseTypeTruck(truck[i].type);

                    if (truckSize.width > load.dimensions.width
                        && truckSize.length > load.dimensions.length
                        && truckSize.height > load.dimensions.height
                        && truckSize.payload > load.payload) {
                        await Truck.findByIdAndUpdate(truck[i]._id, { status: "OL" })
                        await Load.findByIdAndUpdate(createdItem._id, { assignedTo: truck[i].assigned_to, status: "ASSIGNED", state: "En route to Pick Up" })

                    }
                }
            }
            return res.status(200).json({ "message": "Load created successfully" })

        } catch (e) {
            next(e);
        }
    },
    getAllLoads: async (req, res, next) => {
        try {
            if (req.query.offset && !isPositiveNumber(req.query.offset)) {
                throw new ErrorHandler(400, "Parameter 'offset' should be positive number")
            }
            if (req.query.limit && !isPositiveNumber(req.query.limit)) {
                throw new ErrorHandler(400, "Parameter 'limit' should be positive number")
            }
            if (req.query.limit > 50) {
                throw new ErrorHandler(400, "Parameter 'limit' should be less 50")
            }

            if (req.loggedUser.role === "SHIPPER") {
                const userId = req.loggedUser._id.toString();

                const loads = await Load.find({ createdBy: userId, status: "NEW" })
                    .skip(Number(req.query.offset) || 0)
                    .limit(Number(req.query.limit) || 10)

                res.status(200).json({ loads: loads })

            } else if (req.loggedUser.role === "DRIVER") {
                const userId = req.loggedUser._id.toString();

                const driverLoads = await Load.find({ assignedTo: userId, status: 'ASSIGNED' || 'SHIPPED' })
                    .skip(Number(req.query.offset) || 0)
                    .limit(Number(req.query.limit) || 10)

                res.status(200).json({ loads: driverLoads })

            } else {
                throw new ErrorHandler(400, "Fobidden")
            }

        } catch (e) {
            next(e);
        }
    },
    getLoadById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }
            const loadItem = await Load.findById(id);

            if (!loadItem) {
                throw new ErrorHandler(400, "Load not found");
            }

            res.status(200).json({
                "load": {
                    "_id": loadItem._id,
                    "created_by": loadItem.createdBy,
                    "assigned_to": loadItem.assignedTo,
                    "status": loadItem.status,
                    "state": loadItem.state,
                    "name": loadItem.name,
                    "payload": loadItem.payload,
                    "pickup_address": loadItem.pickup_address,
                    "delivery_address": loadItem.delivery_address,
                    "dimensions": {
                        "width": loadItem.dimensions.width,
                        "length": loadItem.dimensions.length,
                        "height": loadItem.dimensions.height,
                    },
                    "created_date": loadItem.createdAt
                }
            })
        } catch (e) {
            next(e);
        }
    },
    deleteLoadById: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }

            const userId = req.loggedUser._id.toString();
            const load = await Load.findById(id);

            if (!load) {
                throw new ErrorHandler(400, "Load not found")
            }
            if (load.status !== "NEW") {
                throw new ErrorHandler(400, "Forbidden update load")
            }
            if (userId !== load.createdBy.toString()) {
                throw new ErrorHandler(400, "Delete permitted only for owner(shipper)")
            }

            await Load.findByIdAndDelete(id);

            res.status(200).json({ "message": "Load deleted successfully" })

        } catch (e) {
            next(e);
        }
    },
    updateLoadInfo: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }

            const userId = req.loggedUser._id.toString();
            const load = await Load.findById(id);

            if (!load) {
                throw new ErrorHandler(400, "Entity not found")
            }
            if (load.status !== "NEW") {
                throw new ErrorHandler(400, "Forbidden update load")
            }

            if (userId !== load.createdBy.toString()) {
                throw new ErrorHandler(400, "Update permitted only for owner")
            }

            await Load.findByIdAndUpdate(id, req.body);

            res.status(200).json({ "message": "Load details changed successfully" })
        } catch (e) {
            next(e);
        }
    },
    getActiveLoad: async (req, res, next) => {
        try {
            const userId = req.loggedUser._id;

            const loadItem = await Load.findOne({ "assignedTo": userId });
            if (!loadItem) {
                res.status(200).json({})
            } else {
                res.status(200).json({
                    "load": {
                        "_id": loadItem._id,
                        "created_by": loadItem.createdBy,
                        "assigned_to": loadItem.assignedTo,
                        "status": loadItem.status,
                        "state": loadItem.state,
                        "name": loadItem.name,
                        "payload": loadItem.payload,
                        "pickup_address": loadItem.pickup_address,
                        "delivery_address": loadItem.delivery_address,
                        "dimensions": {
                            "width": loadItem.dimensions.width,
                            "length": loadItem.dimensions.length,
                            "height": loadItem.dimensions.height,
                        },
                        "created_date": loadItem.createdAt
                    }
                })
            }
        } catch (e) {
            next(e);
        }
    },
    changeDeliveryStatus: async (req, res, next) => {
        try {
            const userId = req.loggedUser._id;

            const loadItem = await Load.findOne({ "assignedTo": userId });
            if (!loadItem) {
                throw new ErrorHandler(400, "Entity not found")
            } else {

                await Load.findByIdAndUpdate(loadItem._id, { "state": "En route to Delivery" })
                res.status(200).json({ "message": "Load state changed to 'En route to Delivery'" })
            }


        } catch (e) {
            next(e)
        }
    },
    findTruck: async (req, res, next) => {
        try {
            const { id } = req.params;
            const load = await Load.findOne({ "_id": id });
            let truck = await Truck.find({ status: "IS" })

            for (let i = 0; i < truck.length; i++) {
                if (truck[i].assigned_to !== null) {

                    let truckSize = truckService.chooseTypeTruck(truck[i].type);

                    if (truckSize.width > load.dimensions.width
                        && truckSize.length > load.dimensions.length
                        && truckSize.height > load.dimensions.height
                        && truckSize.payload > load.payload) {
                        await Truck.findByIdAndUpdate(truck[i]._id, { status: "OL" })
                        await Load.findByIdAndUpdate(id, { "assigned_to": truck[i].assigned_to, status: "ASSIGNED", state: "En route to Pick Up" })

                        return res.status(200).json({
                            "message": "Load posted successfully",
                            "driver_found": true
                        })
                    }
                }
            }
            return res.status(200).json({ "message": "driver not found" })

        } catch (e) {
            next(e)
        }
    }
}