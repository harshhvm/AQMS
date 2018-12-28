const mongoose = require('mongoose');

// Defining the schema for Users
const CustomerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    emailid: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    mobno: {
        type: String,
        required: true,
        unique:true
    }
});

// Naming and exporting  the user mongoose model
const Customer = module.exports = mongoose.model('Customer', CustomerSchema);

module.exports.getAllCustomers = function (callback) {
    Customer.find(callback);
};

module.exports.addCustomer = function (customer, callback) {
    Customer.create(customer, callback);
};

module.exports.getCustomerByID = function (id, callback) {
    Customer.findById(id, callback);
}


module.exports.getCustomerByemailid = function (emailid, callback) {
    let query = {
        emailid:emailid
    }
    Customer.findOne(query, callback)
}

module.exports.getmobno = function (mobno, callback) {
    let query = {
        mobno:mobno
    }
    Customer.findOne(query, callback)
}

module.exports.updatePassword = function (customer, callback) {

    let update = {
        
        password: customer.password
    }
    Customer.findByIdAndUpdate(customer._id, update, callback);
}

module.exports.removeCustomer = function (id, callback) {
    Customer.findByIdAndRemove(id, callback);
}



