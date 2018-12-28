var mqtt = require('mqtt');
var req = require('request');

const baseUrl = "http://localhost:8080/";
//---------------MQTT-----------------------
//var client = mqtt.connect('mqtt server address',{username:'user',password:'password'});
var client = mqtt.connect('mqtt://server address:port');
client.on('connect', () => {
    console.log('MQTT Broker Connected');
    client.subscribe('aqms/+/aq');
    client.subscribe('aqms/+/hd');
    // client.subscribe('#');


});
//Posting aqdata

var options = {
    uri: baseUrl,
    headers: {
        "Content-Type": "application/json"
        // "Content-Type": "text/plain"
    },
    body: {}
}


var messageFunction = function (topic, message) {

    //if check for topic
    //if topic is aq
    //then req for aq
    //else if topic is hd
    //then req for hd

    console.log(topic);
    t = topic.split("/")
    options['body'] = message.toString();
    if (t[2] == "aq") {
        console.log("Data");
        options['uri'] = baseUrl + 'aqdata';
        // console.log(options);
        req.post(options, (err, res, body) => {
            console.log(err);
            console.log(body);
        });
    }
    else if (t[2] == "hd") {
        console.log("Health");
        options['uri'] = baseUrl + 'health';
        // console.log(options);
        req.post(options, (err, res, body) => {
            console.log(err);
            console.log(body);
        });
    };
}


client.on('message', messageFunction);

module.exports = client;