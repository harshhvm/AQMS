const mongoose = require('mongoose');

// Defining the schema for Users
const GatewaySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    gwId: {
        type: String,
        required: true
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
const Gateway = module.exports = mongoose.model('Gateway', GatewaySchema);

module.exports.getAllGateways = function (callback) {
    Gateway.find(callback);
};

module.exports.getAllGatewaysByCustId = function (CustId,callback) {
    let query = {
        custId:CustId
    }
    Gateway.find(query,callback);
};

module.exports.addGateway = function (gateway, callback) {
    console.log("in gateway ");
    
    Gateway.create(gateway, callback);
};

module.exports.getGatewayByID = function (id, callback) {
    Gateway.findById(id, callback);
}

module.exports.getGatewayBycustID = function (custId, callback) {
    Gateway.findById(id, callback);
}

module.exports.getGatewayBygwId = function (gwId, callback) {
    let query = {
        gwId:gwId
    }
    Gateway.findOne(query, callback)
}



module.exports.updateGateway = function (gateway, callback) {
    Gateway.findByIdAndUpdate(gateway._id, gateway, callback);
}

module.exports.removeGateway = function (id, callback) {
    Gateway.findByIdAndRemove(id, callback);
}

