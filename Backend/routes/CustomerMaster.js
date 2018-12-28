const express = require('express');
// Requiring express router
const router = express.Router();
const Customer = require('../models/CustomerMaster_model');

// Get request for getting all the users
router.get("/", (req, res) => {
    Customer.getAllCustomers((err, customers) => {
        if (err)
            res.json({
                success: false,
                msg: err
            });
        else
            res.json({
                success: true,
                msg: customers
            });
    });
});

// POST for adding a user
router.post('/', (req, res) => {
    console.log(req.body)
    if (!req.body.name || !req.body.emailid || !req.body.password || !req.body.mobno)
        res.json({
            success: false,
            msg: 'Incomplete data'
        });
    else {
        Customer.getCustomerByemailid(req.body.emailid, (err, recCustomer) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                if (recCustomer) {
                    res.json({
                        success: false,
                        msg: 'email id already exists'
                    });
                } else {
                    let customer = {
                        name: req.body.name,
                        emailid: req.body.emailid,
                        password: req.body.password,
                        mobno: req.body.mobno
                    }
                    Customer.addCustomer(customer, (err) => {
                        if (err)
                            res.json({
                                success: false,
                                msg: err
                            });
                        else
                            res.json({
                                success: true,
                                msg: 'Added new User'
                            });
                    });
                }
            }
        })
    }
});


// POST for login
router.post('/login', (req, res) => {
    if (!req.body.emailid || !req.body.password)
        res.json({
            success: false,
            msg: 'Incomplete data'
        });
    else {
        let customer = {
            emailid: req.body.emailid,
            password: req.body.password
        }
        Customer.getCustomerByemailid(customer.emailid, (err, recCustomer) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                if (!recCustomer) {
                    res.json({
                        success: false,
                        msg: 'Customer does not exists'
                    });
                } else {
                    if (customer.password != recCustomer.password)
                        res.json({
                            success: false,
                            msg: 'Wrong Password'
                        });
                    else res.json({
                        success: true,
                        msg: {
                            name: recCustomer.name,
                            emailid: recCustomer.emailid,
                            _id: recCustomer._id
                        }
                    });
                }

            }
        })
    }
});



//POST for updating password
router.put('/update', (req, res) => {
    if (!req.body.emailid || !req.body.password || !req.body.newPassword)
        res.json({
            success: false,
            msg: 'Incomplete data'
        });
    else {
        Customer.getCustomerByemailid(req.body.emailid, (err, recCustomer) => {
            if (err)
                res.json({
                    success: false,
                    msg: err
                });
            else {
                if (!recCustomer) {
                    res.json({
                        success: false,
                        msg: 'emailid does not exists'
                    });
                } else {
                    if (req.body.password != recCustomer.password)
                        res.json({
                            success: false,
                            msg: 'Wrong Password'
                        });
                    else {
                        recCustomer.password = req.body.newPassword
                        Customer.updatePassword(recCustomer, (err) => {
                            if (err)
                                res.json({
                                    success: false,
                                    msg: err
                                });
                            else res.json({
                                success: true,
                                msg: 'Password Updated'
                            });
                        })
                    }
                }

            }
        })
    }
})




// Exporting the router as a module
module.exports = router;