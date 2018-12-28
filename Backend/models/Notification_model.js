const mongoose = require('mongoose');
// Defining the schema for Users
const NotificationSchema = mongoose.Schema({
    custId: {
        type: String,
        required: true
    },
    gwId: {
        type: String,
    },
    devId: {
        type: String,
    },
    type: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: Date.now
    },
    status: {
        type: Number,
        default: 0
    }

});
// Naming and exporting  the user mongoose model
const Notification = module.exports = mongoose.model('Notification', NotificationSchema);

module.exports.getAllNotification = function (callback) {
    Notification.find(callback);
};

module.exports.addNotification = function (notification, callback) {
    Notification.create(notification, callback);
};

module.exports.getNewNotification = function (callback) {
    Notification.find({ status: { $eq: 0 } }, callback);
};

module.exports.updateStatus = function(nId,callback){
    Notification.findOneAndUpdate({_id: nId}, {$set:{status:1}}, {new: true},callback)
}