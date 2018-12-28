var mqtt = require('mqtt');
var req = require('request');
var CryptoJS = require("crypto-js");
const Influx = require('influxdb-nodejs');

// MQTT
var obj = { username: 'user', password: 'password' }
var client = mqtt.connect('mqtt://server address', obj);
client.on('connect', () => {
    console.log('MQTT Broker Connected');
    client.subscribe('aqms/postData/+/aq');
    client.subscribe('aqms/postData/+/hd');
});


const clientInflux = new Influx('http://enter address');
const fieldSchema = {
    humidity: 'f',
    temp: 'f',
    ppm: 'f'
};
const tagSchema = {
    devId: '*',
    custId: '*',
};
clientInflux.schema('aqData', fieldSchema, tagSchema, {
    // default is false
    stripUnknown: true,
});

const fieldHDSchema = {
    vcc: 'i',
    heap: 'i',
    rss: 'i'
};
const tagHDSchema = {
    devId: '*',
    custId: '*',
};
clientInflux.schema('hData', fieldHDSchema, tagHDSchema, {
    // default is false
    stripUnknown: true,
});

var msgFn = function (topic, message) {
    console.log(topic);
    var data = JSON.parse(message.toString());
    console.log(data);
    t = topic.split("/")
    if (t[3] == "aq") {
        if (data.devId && data.pk && data.t && data.d) {
            var sensor_msg = data.d;
            var sensor_iv = data.pk;
            // console.log(sensor_msg);
            // console.log(sensor_iv);
            var decoded_msg = decryptData(sensor_msg, sensor_iv)
            console.log("Decryptedage: ", decoded_msg);
            sData = parseJSON(decoded_msg);
            if (sData) {
                if (sData.aq && sData.t && sData.h && sData.dId && sData.cId) {
                    clientInflux.write('aqData')
                        .tag({
                            devId: sData.dId,
                            custId: sData.cId,
                        })
                        .field({
                            ppm: sData.aq,
                            temp: sData.t,
                            humidity: sData.h
                        })
                        .then(() => {
                            console.log("Success")
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                }
                else {
                    console.log("Incomplete Data")
                }
            }
            else
                "JSON Parse ERROR"
        }
        else {
            console.log("Incomplete Data")
        }
    }
    else if (t[3] == "hd") {
        if (data.devId && data.pk && data.t && data.d) {
            var sensor_msg = data.d;
            var sensor_iv = data.pk;
            // console.log(sensor_msg);
            // console.log(sensor_iv);
            var decoded_msg = decryptData(sensor_msg, sensor_iv)
            console.log("Decryptedage: ", decoded_msg);
            sData = parseJSON(decoded_msg);
            if (sData) {
                if (sData.devId && sData.rss && sData.heap && sData.vcc && sData.custId) {
                    clientInflux.write('hData')
                        .tag({
                            devId: sData.devId,
                            custId: sData.custId,
                        })
                        .field({
                            rss: sData.rss,
                            heap: sData.heap,
                            vcc: sData.vcc
                        })
                        .then(() => {
                            console.log("Success")
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                }
                else {
                    console.log("Incomplete Data")
                }
            }
            else
                "JSON Parse ERROR"
        }
        else {
            console.log("Incomplete Data")
        }
    }
};

client.on('message', msgFn);


function parseJSON(JSONString) {
    try {
        return JSON.parse(JSONString);
    } catch (ex) {
        return null;
    }
}

function decryptData(toDecrypt, pk) {
    // The AES encryption/decryption key to be used.
    var AESKey = 'aes key';

    var plain_iv = new Buffer(pk, 'base64').toString('hex');
    var iv = CryptoJS.enc.Hex.parse(plain_iv);
    var key = CryptoJS.enc.Hex.parse(AESKey);
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(toDecrypt, key, { iv: iv });
    var plaintext = bytes.toString(CryptoJS.enc.Base64);
    var decoded_b64msg = new Buffer(plaintext, 'base64').toString('ascii');
    var decoded_msg = new Buffer(decoded_b64msg, 'base64').toString('ascii');
    return decoded_msg
}