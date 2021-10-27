const ErrorHandler = require("../errors/ErrorHandler");

module.exports = {
    chooseTypeTruck: (truckType) => {
        if (truckType === "SPRINTER") {
            return {
                width: 300,
                length: 250,
                height: 170,
                payload: 1700
            }
        } else if (truckType === "SMALL STRAIGHT") {
            return {
                width: 500,
                length: 250,
                height: 170,
                payload: 2500
            }
        } else if (truckType === "LARGE STRAIGHT") {
            return {
                width: 700,
                length: 350,
                height: 200,
                payload: 4000
            }
        }else{
            throw new ErrorHandler(400, "TRUCK type isn`t correct")
        }
    }
}