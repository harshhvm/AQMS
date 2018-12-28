const express = require('express');
// Requiring express router
const router = express.Router();
const Gateway = require('../models/GatewayMaster_model');
const Customer = require('../models/CustomerMaster_model');
const Device = require('../models/DeviceMaster_model');
const AQData = require('../models/AQData_model');
const Notification = require('../models/Notification_model');


// Get request for getting all Notification
router.get("/", (req, res) => {
    Notification.getAllNotification((err, notification) => {
        if (err)
            res.json({
                success: false,
                msg: err
            });
        else
            res.json({
                success: true,
                msg: notification
            });
    });
});

router.post('/', (req, res) => {
    if (!req.body.custId || !req.body.devId || !req.body.type || !req.body.to || !req.body.data) {
        res.json({
            success: false,
            msg: "Incomplete Data"
        });
    }

    else {
        let notification = {
            data: req.body.data,
            to: req.body.to,
            type: req.body.type,
            gwId: req.body.gwId,
            devId: req.body.devId,
            custId: req.body.custId,
            timestamp: req.body.timestamp

        }
        Notification.addNotification(notification, (err) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else
                res.json({
                    success: true,
                    msg: 'Added new notification'
                });
        });
    }
})















module.exports = router;
