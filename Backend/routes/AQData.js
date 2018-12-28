const express = require('express');
// Requiring express router
const router = express.Router();
const Gateway = require('../models/GatewayMaster_model');
const Customer = require('../models/CustomerMaster_model');
const Device = require('../models/DeviceMaster_model');
const AQData = require('../models/AQData_model');
const Notification = require('../models/Notification_model');
var CryptoJS = require("crypto-js");

const aqThreshold = 30;
var prcDataQ = [];

// Get request for getting all aqdata
router.get("/", (req, res) => {
    AQData.getAllAQData((err, aqdatas) => {
        if (err)
            res.json({
                success: false,
                msg: err
            });
        else
            res.json({
                success: true,
                msg: aqdatas
            });
    });
});

//Secure Post
router.post('/', (req, res) => {
    console.log(req.body)
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
                    // The AES encryption/decryption key to be used.
                    // var AESKey = '';
                    var AESKey = 'enter key';

                    var plain_iv = new Buffer(sensor_iv, 'base64').toString('hex');
                    var iv = CryptoJS.enc.Hex.parse(plain_iv);
                    var key = CryptoJS.enc.Hex.parse(AESKey);
                    // Decrypt
                    var bytes = CryptoJS.AES.decrypt(sensor_msg, key, { iv: iv });
                    var plaintext = bytes.toString(CryptoJS.enc.Base64);
                    var decoded_b64msg = new Buffer(plaintext, 'base64').toString('ascii');
                    var decoded_msg = new Buffer(decoded_b64msg, 'base64').toString('ascii');
                    console.log("Decryptedage: ", decoded_msg);
                    sData = parseJSON(decoded_msg);
                    if (sData) {
                        if (sData.aq > aqThreshold) {
                            addNotificationToDb(sData, "Air Quality is poor.", "sms")
                            addNotificationToDb(sData, "Air Quality is poor.", "email")
                        }
                        let tData = {
                            aq: sData.aq,
                            temp: sData.t,
                            hum: sData.h,
                            devId: sData.dId,
                            custId: sData.cId
                        }
                        AQData.addAQData(tData, (err, recDat) => {
                            if (err)
                                res.json({
                                    success: false,
                                    msg: err
                                });
                            else
                                res.json({
                                    success: true,
                                    msg: 'Added new aqdata'
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
                    var flg = true;
                    var devFlg = false;

                    var sensor_msg = req.body.d;
                    var sensor_iv = req.body.pk;
                    // console.log(sensor_msg);
                    // console.log(sensor_iv);
                    // The AES encryption/decryption key to be used.
                    // var AESKey = '';
                    var AESKey = 'enter aes key';

                    var plain_iv = new Buffer(sensor_iv, 'base64').toString('hex');
                    var iv = CryptoJS.enc.Hex.parse(plain_iv);
                    var key = CryptoJS.enc.Hex.parse(AESKey);
                    // Decrypt
                    var bytes = CryptoJS.AES.decrypt(sensor_msg, key, { iv: iv });
                    var plaintext = bytes.toString(CryptoJS.enc.Base64);
                    var decoded_b64msg = new Buffer(plaintext, 'base64').toString('ascii');
                    var decoded_msg = new Buffer(decoded_b64msg, 'base64').toString('ascii');
                    console.log("Decryptedage: ", decoded_msg);
                    sData = parseJSON(decoded_msg);
                    if (sData) {
                        sData.forEach((data, indx) => {
                            prcDataQ.push(indx);
                            checkDevId(data, (err, rslt) => {
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
                addDataToAq(data, (err, resp) => {
                    console.log("addDataToAq", data.devId);
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

addDataToAq = function (d, callback) {
    //Code for checking threshold value call function
    if (d.aq > aqThreshold) {
        addNotificationToDb(d, "Air Quality is poor.", "sms");
        addNotificationToDb(d, "Air Quality is poor.", "email");
    }
    AQData.addAQData(d, (err, recDat) => {
        if (err) {
            callback(err, null);
        }
        else
            callback(null, true);
    })
}

//Function to check threshold value if exiceed add notification to model
function addNotificationToDb(dObj, msg, ntype) {
    Customer.getCustomerByID(dObj.cId, (err, recCustomer) => {
        var toStr = '';
        if (ntype == 'sms')
            toStr = recCustomer.mobno
        else if (ntype == 'email')
            toStr = recCustomer.emailid
        let notifmsg = {
            data: msg,
            to: toStr,
            type: ntype,
            devId: dObj.dId,
            custId: dObj.cId,
        }
        Notification.addNotification(notifmsg, (err, rslt) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(rslt);
                console.log("Notification Added");
            }
        });
    })
}


module.exports = router;
