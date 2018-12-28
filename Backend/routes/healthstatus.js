const express = require('express');
// Requiring express router
const router = express.Router();
const Gateway = require('../models/GatewayMaster_model');
const Customer = require('../models/CustomerMaster_model');
const Device = require('../models/DeviceMaster_model');
const AQData = require('../models/AQData_model');
const Notification = require('../models/Notification_model');
const HealthStatus = require('../models/healthstatus_model');

var CryptoJS = require("crypto-js");

var prcDataQ = [];


// Get request for getting all Notification
router.get("/", (req, res) => {
    HealthStatus.getAllDevicehealth((err, healthstatus) => {
        if (err)
            res.json({
                success: false,
                msg: err
            });
        else
            res.json({
                success: true,
                msg: healthstatus
            });
    });
});

router.get("/byCustId", (req, res) => {
    if (!req.query.CustID)
        res.json({
            success: false,
            msg: "Invalid Input"
        });
    else {
        HealthStatus.getAllDataByCustId(req.query.CustID, (err, aqData) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else
                res.json({
                    success: true,
                    msg: aqData
                });
        });
    }
});

//Secure Post
router.post('/', (req, res) => {
    if (!req.body.d || !req.body.pk || !req.body.devId || !req.body.t) {
        res.json({
            error: 'invalid input'
        });
    }
    else {
        // Device.getDeviceBydevId(req.body.devId.toString(), (err, recDat) => {
        Device.getDeviceByID(req.body.devId.toString(), (err, recDat) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                if (!recDat) {
                    res.json({
                        success: false,
                        msg: 'Device does not exists'
                    });
                } else {
                    var sensor_msg = req.body.d;
                    var sensor_iv = req.body.pk;
                    // console.log(sensor_msg);
                    // console.log(sensor_iv);
                    var decoded_msg = decryptData(sensor_msg, sensor_iv)
                    sData = parseJSON(decoded_msg);
                    if (sData) {
                        console.log();
                        console.log(sData);
                        HealthStatus.addDevicehealthstatus(sData, (err, recDat) => {
                            if (err)
                                res.json({
                                    success: false,
                                    msg: err
                                });
                            else
                                res.json({
                                    success: true,
                                    msg: 'Added new data'
                                });
                        })
                    }
                    else
                        console.log("JSON Parse ERROR")
                }
            }
        });
    }
});

router.post('/batchData', (req, res) => {
    console.log(req.body);
    if (!req.body.d || !req.body.pk || !req.body.gwId || !req.body.t) {
        res.json({
            error: 'invalid input'
        });
    }
    else {
        Gateway.getGatewayByID(req.body.gwId, (err, resGw) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                if (!resGw) {
                    res.json({
                        success: false,
                        msg: 'Gateway does not exists'
                    });
                }
                else {
                    //TODO : Cancel callback for device id not found
                    console.log(typeof req.body.d);
                    var flg = true;
                    var devFlg = false;

                    var sensor_msg = req.body.d;
                    var sensor_iv = req.body.pk;
                    // console.log(sensor_msg);
                    // console.log(sensor_iv);
                    var decoded_msg = decryptData(sensor_msg, sensor_iv)
                    console.log("Decryptedage: ", decoded_msg);
                    sData = parseJSON(decoded_msg);
                    if (sData) {
                        sData.forEach((data, indx) => {
                            prcDataQ.push(indx);
                            console.log("for...", indx);
                            checkDevId(data, (err, rslt) => {
                                console.log("checkDevId...", data.devId);
                                if (err)
                                    res.json({
                                        success: false,
                                        msg: err
                                    });
                                else {
                                    prcDataQ.pop();
                                    if (prcDataQ.length == 0) {
                                        res.json({
                                            success: true,
                                            msg: "Data added successfully"
                                        });
                                    }
                                }
                            });
                        });
                    }
                    else
                        console.log("JSON Parse ERROR")
                }
            }
        });
    }
});


function parseJSON(JSONString) {
    try {
        return JSON.parse(JSONString);
    } catch (ex) {
        return null;
    }
}


checkDevId = function (data, callback) {
    console.log("checkDevId", data.devId);
    Device.getDeviceByID(data.devId, (err, recDev) => {
        if (err) {
            callback(err, null);
        }
        else {
            if (!recDev) {
                callback(null, false);
            }
            else {
                addDataToHealth(data, (err, resp) => {
                    console.log("addDataToHealth", data.devId);
                    if (err) {
                        callback(err, null);
                    }
                    else
                        callback(null, true);
                });

            }
        }
    });
}

addDataToHealth = function (d, callback) {
    HealthStatus.addDevicehealthstatus(d, (err, recDat) => {
        if (err) {
            callback(err, null);
        }
        else
            callback(null, true);
    })
}

function decryptData(toDecrypt, pk) {
    // The AES encryption/decryption key to be used.
    var AESKey = '';

    var plain_iv = new Buffer(pk, 'base64').toString('hex');
    var iv = CryptoJS.enc.Hex.parse(plain_iv);
    var key = CryptoJS.enc.Hex.parse(AESKey);
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(toDecrypt, key, { iv: iv });
    var plaintext = bytes.toString(CryptoJS.enc.Base64);
    var decoded_b64msg = new Buffer(plaintext, 'base64').toString('ascii');
    var decoded_msg = new Buffer(decoded_b64msg, 'base64').toString('ascii');
    return decoded_msg
}


module.exports = router;
