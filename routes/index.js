var express = require('express');
var router = express.Router();
var ParkingLotModel = require("../models/ParkingLotModel");
var mongoose = require("mongoose");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Parking Lot App'});
});
router.post('/updateMetadata', function (req, res) {
    var data = req.body;
    var regex = / [+-]?\d+(\.\d+)?/g
    var floats = data.boxes.match(regex).map(function(v) { return parseFloat(v); });
    data.boxes = [];
    for(var i =0;i<floats.length;i+=4){
        data.boxes.push(floats.slice(i,i+4));
    }
    var probabilities = data.probabilities.match(regex).map(function(v) { return parseFloat(v); });
    data.probabilities = probabilities;
    ParkingLotModel.findOne({label: "default"}, function (err, doc) {
        if (err) console.log("Error finding default", err);
        if (doc) {
            if (data.count <= doc.maxSize) {
                doc.currentSize = data.count;
            }
            for (var i = 0; i < data.boxes.length; i++) {
                var xdata = data.boxes[i][0];
                var ydata = data.boxes[i][1];
                if (doc.thresh ^ 2 >= (Math.pow(doc[i].xmin - xdata, 2) + Math.pow(doc[i].ymin - ydata, 2))) {
                    doc[i].xmin = xdata;
                    doc[i].ymin = ydata;
                    doc[i].prob = data.probabilities[i];
                } else {
                    doc[i].prob = 0;
                }
                if (i === data.boxes.length - 1) {
                    doc.save(function (err, result) {
                        if (err) {
                            console.log("Error saving the doc", err);
                        } else {
                            res.status(200).send("Ok!");
                        }
                    })
                }
            }
        } else {
            res.status(200).send("Create the default first");
        }
    });
});
/**
 * Only for local use since anyone could spam this address
 * */
/*router.post('/createDefault', function (req, res) {
    var data = req.body;

    data["_id"] = mongoose.Types.ObjectId();
    var regex = / [+-]?\d+(\.\d+)?/g
    var floats = data.boxes.match(regex).map(function(v) { return parseFloat(v); });
    data.boxes = [];
    for(var i =0;i<floats.length;i+=4){
        data.boxes.push(floats.slice(i,i+4));
    }
    var probabilities = data.probabilities.match(regex).map(function(v) { return parseFloat(v); });
    data.probabilities = probabilities;
    var parkingLot = new ParkingLotModel();
    parkingLot.maxSize = data.count;
    parkingLot.currentSize = data.count;
    parkingLot.label = "default";
    parkingLot.thresh = 0.04;
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
        }else{
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
