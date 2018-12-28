// Requiring the express middlewear
const express = require('express');
// creating an instance of express
const app = express();
// requiring the modules
const path = require('path');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//  Requiring mqtt Client file
const mqttC = require('./config/mqttBridge');

const notifi = require('./config/sendNotification');

//  Requiring credentials file
const cred = require('./config/credentials');

// -------- MongoDB operations----------------
mongoose.connect(cred.database);

mongoose.connection.on('connected', () => {
    console.log('Connected to Database');
});

mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

//--------------------------------------------

app.use(cors());

// use environment port if avilable othervise use 8080
const port = process.env.port || 8080;

// express static folder path
app.use(express.static(path.join(__dirname, "public")));
// using bodyparser for parsing json body from requests
app.use(bodyparser.text());
app.use(bodyparser.json());

// // requiring routes for resources
const customer = require('./routes/CustomerMaster');
const gateway = require('./routes/GatewayMaster');
const device = require('./routes/DeviceMaster');
const aqdata = require('./routes/AQData');
const notification = require('./routes/Notification');
const healthstatus = require('./routes/healthstatus');
const reportData = require('./routes/reportData');


// // using routes for resources
app.use('/customer', customer);
app.use('/gateway', gateway);
app.use('/device', device);
app.use('/aqdata', aqdata);
app.use('/notif', notification);
app.use('/health', healthstatus);
app.use('/report', reportData);

notifi();

// Routing all requests to the static file
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start listening to requests
app.listen(port, () => {
    console.log('Server running on port: ' + port);
});