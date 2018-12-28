const express = require('express');
// Requiring express router
const router = express.Router();
const Gateway = require('../models/GatewayMaster_model');
const Customer = require('../models/CustomerMaster_model');
const Device = require('../models/DeviceMaster_model');
// Get request for getting all the gateways user
router.get("/", (req, res) => {
    Device.getAllDevices((err, devices) => {
        if (err)
            res.json({
                success: false,
                msg: err
            });
        else
            res.json({
                success: true,
                msg: devices
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
        Device.getAllDevicesByCustId(req.query.CustID, (err, devices) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else
                res.json({
                    success: true,
                    msg: devices
                });
        });
    }
});

// POST for adding a devicew
router.post('/', (req, res) => {
    if (!req.body.name || !req.body.longitude || !req.body.latitude || !req.body.devId || !req.body.custId) {
        res.json({
            success: false,
            msg: "Incomplete Data"
        });
    }
    else {
        Customer.getCustomerByID(req.body.custId, (err, recCust) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                if (recCust) {
                    //If gw is present
                    if (req.body.gwId) {
                        Gateway.getGatewayByID(req.body.gwId, (err, recGat) => {
                            if (err)
                                res.json({
                                    success: false,
                                    msg: err
                                });
                            else {
                                if (recGat) {
                                    let devices = {
                                        name: req.body.name,
                                        longitude: req.body.longitude,
                                        latitude: req.body.latitude,
                                        gwId: req.body.gwId,
                                        custId: req.body.custId,
                                        devId: req.body.devId
                                    }
                                    Device.addDevice(devices, (err) => {
                                        if (err)
                                            res.json({
                                                success: false,
                                                msg: err
                                            });
                                        else
                                            res.json({
                                                success: true,
                                                msg: 'Added new device'
                                            });
                                    });
                                }
                                else {
                                    res.json({
                                        success: true,
                                        msg: "Gateway not present"
                                    });
                                }
                            }
                        });
                    }
                    //gw is not present
                    else {
                        if (recCust) {
                            let devices = {
                                name: req.body.name,
                                longitude: req.body.longitude,
                                latitude: req.body.latitude,
                                custId: req.body.custId,
                                devId: req.body.devId
                            }
                            Device.addDevice(devices, (err) => {
                                if (err)
                                    res.json({
                                        success: false,
                                        msg: err
                                    });
                                else
                                    res.json({
                                        success: true,
                                        msg: 'Added new device without gateway'
                                    });
                            });
                        }
                    }
                }
                else {
                    res.json({
                        success: true,
                        msg: "Customer not exist"
                    });
                }
            }
        });

    }
});



//POST for updating password
router.put('/', (req, res) => {
    console.log(req.body);
    if (!req.body.name || !req.body.longitude || !req.body.latitude || !req.body.devId || !req.body.custId)
        res.json({
            success: false,
            msg: 'Incomplete data'
        });
    else {
        Device.getDeviceByID(req.body._id, (err, recDev) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                console.log(recDev);
                if (!recDev) {
                    res.json({
                        success: false,
                        msg: 'Device does not exists'
                    });
                }
                else {
                    let devObj = {
                        _id : req.body._id,
                        name: req.body.name,
                        longitude: req.body.longitude,
                        latitude: req.body.latitude,
                        custId: req.body.custId,
                        devId: req.body.devId
                    }
                    if (req.body.gwId)
                        devObj["gwId"] = req.body.gwId;
                    Device.updateDevice(devObj, (err) => {
                        if (err)
                            res.json({
                                success: false,
                                msg: err
                            });
                        else
                            res.json({
                                success: true,
                                msg: 'Device Updated'
                            });
                    });
                }

            }
        });
    }
})




// Exporting the router as a module
module.exports = router;