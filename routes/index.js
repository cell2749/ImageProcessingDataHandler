var express = require('express');
var router = express.Router();
var ParkingLotModel = require("../models/ParkingLotModel");
var socketClient = require("socket.io-client").connect('https://g6-os.herokuapp.com');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Parking Lot App'});
});
router.post('/updateMetadata', function (req, res) {
    var data = req.body;
    var regex = / [+-]?\d+(\.\d+)?/g
    var filtered = data.boxes.match(regex);
    var floats = [];
    if (filtered !== null) {
        floats = data.boxes.match(regex).map(function (v) {
            return parseFloat(v);
        });
    }
    data.boxes = [];
    for (var i = 0; i < floats.length; i += 4) {
        data.boxes.push(floats.slice(i, i + 4));
    }
    regex = /[+-]?\d+(\.\d+)?/g
    filtered = data.probabilities.match(regex);
    var probabilities=[];
    if (filtered !== null) {
        probabilities = filtered.map(function (v) {
            return parseFloat(v);
        });
    }
    data.probabilities = probabilities;
    ParkingLotModel.findOne({label: "default"}, function (err, doc) {
        if (err) console.log("Error finding default", err);
        if (doc) {
            if (data.count <= doc.maxSize) {
                doc.currentSize = data.count;
            }

            for (var k = 0; k < doc.map.length; k++) {
                var saved = false;
                for (var i = 0; i < data.boxes.length; i++) {
                    var xdata = data.boxes[i][0];
                    var ydata = data.boxes[i][1];

                    if (Math.pow(0.004, 2) >= (Math.pow(doc.map[k].xmin - xdata, 2) + Math.pow(doc.map[k].ymin - ydata, 2))) {
                        doc.map[k].xmin = xdata;
                        doc.map[k].ymin = ydata;
                        doc.map[k].prob = data.probabilities[i];
                        saved = true;
                    }
                }
                if (!saved) {
                    doc.map[k].prob = 0;
                    saved = true;
                }
                if (k === doc.map.length - 1 && saved) {
                    doc.save(function (err, result) {
                        if (err) {
                            console.log("Error saving the doc", err);
                        } else {
                            socketClient.emit("triggerUpdate", result);
                            res.status(200).send("Ok!");
                        }
                    });
                }
                saved = false;
            }
        } else {
            res.status(200).send("Create the default first");
        }
    });
});
/**
 * Only for local use since anyone could spam this address
 * Used only for creating the parking lot template (parking spots)
 * */
/*router.post('/createDefault', function (req, res) {
    var data = req.body;

    data["_id"] = mongoose.Types.ObjectId();
    var regex = / [+-]?\d+(\.\d+)?/g
    var floats = data.boxes.match(regex).map(function (v) {
        return parseFloat(v);
    });
    data.boxes = [];
    for (var i = 0; i < floats.length; i += 4) {
        data.boxes.push(floats.slice(i, i + 4));
    }
    var probabilities = data.probabilities.match(regex).map(function (v) {
        return parseFloat(v);
    });
    data.probabilities = probabilities;
    var parkingLot = new ParkingLotModel();
    parkingLot.maxSize = data.count;
    parkingLot.currentSize = data.count;
    parkingLot.label = "default";
    parkingLot.thresh = 0.004;
    for (var i = 0; i < data.boxes.length; i++) {
        parkingLot.map.push({
            xmin: data.boxes[i][0],
            ymin: data.boxes[i][1],
            prob: data.probabilities[i]
        });
    }
    parkingLot.save(function (err) {
        if (err) {
            console.log(err)
            res.status(200).send('Not OK!');
        } else {
            res.status(200).send('Default saved successfully!');
        }

    });
});*/
router.get("/getDefaultParkingLot", function (req, res) {
    ParkingLotModel.findOne({label: "default"}, function (err, result) {
        if (err) {
            console.log(err);
            res.status(200).send("error retrieving the data");
        } else {
            res.status(200).json(result);
        }
    });
});
module.exports = router;
