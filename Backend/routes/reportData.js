const express = require('express');
// Requiring express router
const router = express.Router();
const Gateway = require('../models/GatewayMaster_model');
const Customer = require('../models/CustomerMaster_model');
const Device = require('../models/DeviceMaster_model');
const AQData = require('../models/AQData_model');
var CryptoJS = require("crypto-js");

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


router.get("/byDevId", (req, res) => {
    console.log("byDevId");
    if (!req.query.DevID)
        res.json({
            success: false,
            msg: "Invalid Input"
        });
    else {
        AQData.getCurrentAQDataByDevId(req.query.DevID, (err, aqData) => {
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

router.get("/currentData", (req, res) => {
    console.log("currentData");
    
    AQData.getCurrentAQData((err, aqdatas) => {
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


router.get("/byCustId", (req, res) => {
    if (!req.query.CustID)
        res.json({
            success: false,
            msg: "Invalid Input"
        });
    else {
        AQData.getAllDataByCustId(req.query.CustID, (err, aqData) => {
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



router.get("/byDevId", (req, res) => {
    if (!req.query.DevID)
        res.json({
            success: false,
            msg: "Invalid Input"
        });
    else {
        AQData.getAllDataByDevId(req.query.DevID, (err, aqData) => {
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


module.exports = router;
