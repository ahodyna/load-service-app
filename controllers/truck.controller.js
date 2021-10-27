const { Truck } = require("../dataBase");
const ErrorHandler = require("../errors/ErrorHandler");
const mongoose = require("mongoose");



function isValidMongoId(id) {
    try {
        new mongoose.Types.ObjectId(id);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    createTruck: async (req, res, next) => {
        try {
            const truck = req.body;
            truck.created_by = req.loggedUser._id;

            await Truck.create({
                created_by: truck.created_by,
                type: truck.type
            });

            return res.status(200).json({ "message": "Truck created successfully" })

        } catch (e) {
            next(e);
        }
    },
    getAllTrucks: async (req, res, next) => {
        try {

            const userId = req.loggedUser._id.toString();

            Truck.find({ created_by: userId })
                .then((response) => {
                    let serchedResult = response.map((truckItem) => {
                        return {
                            "_id": truckItem._id,
                            "created_by": truckItem.created_by,
                            "assigned_to": truckItem.assigned_to,
                            "type": truckItem.type,
                            "status": truckItem.status,
                            "created_date": truckItem.createdAt
                        };
                    });
                    res.status(200).json({
                        "trucks": serchedResult
                    })
                })

        } catch (e) {
            next(e);
        }
    },
    getTruckById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }
            const truckItem = await Truck.findById(id);

            if (!truckItem) {
                throw new ErrorHandler(400, "Truck not found");
            }

            res.status(200).json({
                "truck": {
                    "_id": truckItem._id,
                    "created_by": truckItem.created_by,
                    "assigned_to": truckItem.assigned_to,
                    "type": truckItem.type,
                    "status": truckItem.status,
                    "created_date": truckItem.createdAt
                }
            })
        } catch (e) {
            next(e);
        }
    },
    deleteTruckById: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }

            const userId = req.loggedUser._id.toString();
            const truck = await Truck.findById(id);

            if (!truck) {
                throw new ErrorHandler(400, "Truck not found")
            }

            if (truck.status !== 'IS') {
                throw new ErrorHandler(400, "Forbidden delete assigned truck")
            }

            if (userId !== truck.created_by.toString()) {
                throw new ErrorHandler(400, "Delete permitted only for owner(driver)")
            }

            await Truck.findByIdAndDelete(id);

            res.status(200).json({ "message": "Truck deleted successfully" })

        } catch (e) {
            next(e);
        }
    },
    updateTruckInfo: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }

            const userId = req.loggedUser._id.toString();
            const truck = await Truck.findById(id);

            if (!truck) {
                throw new ErrorHandler(400, "Entity not found")
            }

            if (truck.status !== 'IS') {
                throw new ErrorHandler(400, "Forbidden delete assigned truck")
            }

            if (userId !== truck.created_by.toString()) {
                throw new ErrorHandler(400, "Update permitted only for owner")
            }

            await Truck.findByIdAndUpdate(id, req.body);

            res.status(200).json({ "message": "Truck details changed successfully" })
        } catch (e) {
            next(e);
        }
    },
    assignTruck: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }

            const userId = req.loggedUser._id.toString();

            const truck = await Truck.findById(id);
            const assignTruck = await Truck.findOne({ "assigned_to": req.loggedUser._id });

            if (!truck) {
                throw new ErrorHandler(400, "Entity not found")
            }
            if (userId !== truck.created_by.toString()) {
                throw new ErrorHandler(400, "You can choose only your truck")
            }
            if (assignTruck === null) {

                await Truck.findByIdAndUpdate(id, { "assigned_to": req.loggedUser._id });

            } else {
                throw new ErrorHandler(400, "You cannot choose more than 1 truck")
            }
            res.status(200).json({ "message": "Truck assigned successfully" })
        } catch (e) {
            next(e)
        }
    }
}