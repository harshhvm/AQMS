const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
// Defining the schema for Users
const HealthstatusSchema = mongoose.Schema({
    gwId: {
        type: String,
    },
    devId: {
        type: String,
    },
    custId: {
        type: String,
        required: true
    },
    cputemp: {
        type: SchemaTypes.Double,
    },
    freeram: {
        type: SchemaTypes.Double,
    },
    freesdcard: {
        type: SchemaTypes.Double,
    },
    rss: {
        type: SchemaTypes.Double,
    },
    vcc: {
        type: SchemaTypes.Double,
    },
    heap: {
        type: SchemaTypes.Double,
    },
    timestamp: {
        type: String,
        default: Date.now
    },

});

// Naming and exporting  the user mongoose model
const Health = module.exports = mongoose.model('Health', HealthstatusSchema);

//get queries
module.exports.getAllDevicehealth = function (callback) {
    Health.find(callback);
};

module.exports.getAllDataByCustId = function (custId, callback) {
    let query = {
        custId: custId
    }
    Health.find(query, null, { limit: 100 }, callback);
};


module.exports.getAllDevicehealthByGatewayId = function (gwId, callback) {
    let query = {
        gwId: gwId
    }
    Health.find(query, callback);
};
//Getting device data by using health id
module.exports.getDevicehealthBydevID = function (devId, callback) {
    let query = {
        devId: devId
    }
    Health.find(query, callback);
};



module.exports.addDevicehealthstatus = function (health, callback) {
    Health.create(health, callback);
};






