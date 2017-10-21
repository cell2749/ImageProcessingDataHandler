var mongoose = require("mongoose");
var parkingLotSchema = mongoose.Schema(
    {
        "label": String,
        "maxSize": Number,
        "currentSize": Number,
        "map": [{
            "xmin": Number,
            "ymin": Number,
            "prob": Number
        }],
        "thresh": Number
    }
);

var ParkingLotModel = mongoose.model("ParkingLot", parkingLotSchema);
module.exports = ParkingLotModel;