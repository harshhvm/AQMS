const mongoose = require('mongoose');
// Defining the schema for Users
const Device = require('../models/DeviceMaster_model');

const AQDataSchema = mongoose.Schema({
    aq: {
        type: String,
        required: true
    },
    temp: {
        type: String,
        required: true,
    },
    hum: {
        type: String,
        required: true,
    },
    gwId: {
        type: String,
    },
    devId: {
        type: String,
        required: true,

    },
    custId: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: Date.now
    }

});

// Naming and exporting  the user mongoose model
const AQData = module.exports = mongoose.model('AQData', AQDataSchema);

module.exports.getAllAQData = function (callback) {
    AQData.find(callback);
};

module.exports.addAQData = function (aqdata, callback) {
    console.log("in AQData  ");
    AQData.create(aqdata, callback);
};

module.exports.getAQDataByID = function (id, callback) {
    AQData.findById(id, callback);
}

module.exports.getAQDataBycustID = function (custId, callback) {
    AQData.findById(id, callback);
}

module.exports.getAQDataBygwID = function (gwId, callback) {
    AQData.findById(id, callback);
}

module.exports.getAllDataByCustId = function (custId, callback) {
    query = {
        custId: custId
    }
    AQData.find(query, null, { sort: { _id: -1 } }, callback);
}

module.exports.getAllDataByDevId = function (devId, callback) {
    query = {
        devId: devId
    }
    AQData.find(query, null, { sort: { _id: -1 } }, callback);
}

module.exports.getCurrentAQDataByDevId = function (devId, callback) {
    query = {
        devId: devId
    }
    AQData.find(query, null, { sort: { _id: -1 }, limit: 1 }, callback);
}


module.exports.getCurrentAQData = function (callback) {
    console.log("getCurrentAQData")
    query = {
        custId: "5b574235ceebec3db3cd130c",
        devId: "5b59a30a0f7e613d2b4548f7"
    }
    var rslt = []
    Device.getDeviceBycustID(query.custId, (err, resp) => {
        resp.forEach(element => {
            query['devId'] = element._id
            console.log(query);
            AQData.find(query, null, { sort: { _id: -1 }, limit: 1 }, (err, res) => {
                // console.log(res);
                rslt.push(res);
            });
            console.log(rslt);
        });
    });

}


