const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
// Defining the schema for Users
const DeviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    longitude: {
        type: SchemaTypes.Double,
        required: true,
    },
    latitude: {
        type: SchemaTypes.Double,
        required: true,
    },
    gwId: {
        type: String,
    },
    devId: {
        type: String,
        required: true,
        unique:true
    },
    custId: {
        type: String,
        required: true
    },
    Key: {
        type: String,
        default:"asdasd"
    }
});

// Naming and exporting  the user mongoose model
const Device = module.exports = mongoose.model('Device', DeviceSchema);

module.exports.getAllDevices = function (callback) {
    Device.find(callback);
};

module.exports.getAllDevicesByCustId = function (CustId,callback) {
    let query = {
        custId:CustId
    }
    Device.find(query,callback);
};

module.exports.addDevice = function (device, callback) {
    console.log("in device ");
    
    Device.create(device, callback);
};

module.exports.getDeviceByID = function (id, callback) {
    Device.findById(id, callback);
}

module.exports.getDeviceBycustID = function (custId, callback) {
    let query = {
        custId:custId
    }
    Device.find(query, callback);
}
module.exports.getDeviceBygwID = function (gwId, callback) {
    Device.findById(id, callback);
}

module.exports.getDeviceBydevId = function (devId, callback) {
    let query = {
        devId:devId
    }
    Device.findOne(query, callback)
}

module.exports.updateDevice = function (device, callback) {
    Device.findByIdAndUpdate(device._id, device, callback);
}

module.exports.removeDevice = function (id, callback) {
    Device.findByIdAndRemove(id, callback);
}

