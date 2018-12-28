const express = require('express');
// Requiring express router
const router = express.Router();
const Gateway = require('../models/GatewayMaster_model');
const Customer = require('../models/CustomerMaster_model');

// Get request for getting all the gateways user
router.get("/", (req, res) => {
    Gateway.getAllGateways((err, gateways) => {
        if (err)
            res.json({
                success: false,
                msg: err
            });
        else
            res.json({
                success: true,
                msg: gateways
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
        Gateway.getAllGatewaysByCustId(req.query.CustID, (err, gateways) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else
                res.json({
                    success: true,
                    msg: gateways
                });
        });
    }
});

// POST for adding a user
router.post('/', (req, res) => {
    if (!req.body.name || !req.body.longitude || !req.body.latitude || !req.body.gwId || !req.body.custId) {
        res.json({
            error: 'invalid input'
        });
    }
    else {
        Customer.getCustomerByID(req.body.custId.toString(), (err, recGat) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                if (!recGat) {
                    res.json({
                        success: false,
                        msg: 'customer id  not exists'
                    });
                }
                else {
                    let gateway = {
                        name: req.body.name,
                        longitude: req.body.longitude,
                        latitude: req.body.latitude,
                        gwId: req.body.gwId,
                        custId: req.body.custId
                    }
                    Gateway.addGateway(gateway, (err) => {
                        if (err)
                            res.json({
                                success: false,
                                msg: err
                            });
                        else
                            res.json({
                                success: true,
                                msg: 'Added new Gateway'
                            });
                    });
                }
            }
        })
    }
});



//POST for updating password
router.put('/', (req, res) => {
    if (!req.body._id || !req.body.name || !req.body.longitude || !req.body.latitude || !req.body.gwId)
        res.json({
            success: false,
            msg: 'Incomplete data'
        });
    else {
        Gateway.getGatewayByID(req.body._id, (err, recGat) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                if (!recGat) {
                    res.json({
                        success: false,
                        msg: 'Gatewayid does not exists'
                    });
                } else {
                    let gw ={
                        _id : req.body._id,
                        name : req.body.name,
                        longitude:req.body.longitude,
                        latitude: req.body.latitude,
                        gwId : req.body.gwId
                    }
                    Gateway.updateGateway(gw, (err) => {
                        if (err)
                            res.json({
                                success: false,
                                msg: err
                            });
                        else res.json({
                            success: true,
                            msg: 'Gateway Updated'
                        });
                    })
                }
            }
        })
    }
})




// Exporting the router as a module
module.exports = router;