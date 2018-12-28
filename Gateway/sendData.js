const Influx = require('influx');
const req = require('request');
var CryptoJS = require("crypto-js");
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'aqms',
    retentionPolicy: 'avg_data'
})

let gwId = 'enter id';
let custId = 'enter id';
let serverURI = 'server address:port';
//post
var options = {
    uri: "http://" + serverURI,
    headers: {
        "Content-Type": "application/json"
    },
    body: {}
}

setInterval(getDataFromDb, 180 * 1000);

function sendData(jsonData,uri) {
    //    console.log(jsonData);
    encryptData = encrypt(JSON.stringify(jsonData));
    encryptData['t'] = Date.now()
    encryptData['gwId'] = gwId;
    console.log(encryptData);
    options['uri'] = uri;
    options['body'] = JSON.stringify(encryptData);
    req.post(options, (err, res, body) => {
        console.log(err);
        console.log(body);
    });
}

setInterval(getHealthDataFromDb, 180 * 1000);

function getDataFromDb() {
    console.log("getDataFromDb")
    influx.query('select * from aqms.avg_data.avgAqData where time > now() - 3m').then(results => {
        var avgData = [];
        if (results['groupRows'].length > 0) {
            (results['groupRows'][0]['rows']).forEach(d => {
                var temp = {};
                temp['time'] = d.time['_nanoISO'];
                temp['hum'] = d.meanHumi.toFixed(2);
                temp['temp'] = d.meanTemp.toFixed(2);
                temp['aq'] = d.meanPPM.toFixed(2);
                temp['devId'] = d.devId;
                temp['gwId'] = gwId;
                temp['custId'] = custId;
                avgData.push(temp);
            })
            //            console.log(avgData);
            sendData(avgData,"http://" + serverURI + '/aqdata/batchData');
        }
    })
}

function getHealthDataFromDb() {
    console.log("getHealthDataFromDb")
    influx.query('select * from aqms.one_hr.hData where time > now() - 3m').then(results => {
        var healthData = [];
        if (results['groupRows'].length > 0) {
            (results['groupRows'][0]['rows']).forEach(d => {
                // console.log(d);
                var temp = {};
                temp['vcc'] = d.vcc;
                temp['rss'] = d.rss;
                temp['heap'] = d.heap;
                temp['devId'] = d.devId;
                temp['gwId'] = gwId;
                temp['custId'] = custId;
                healthData.push(temp);
            })
            console.log(healthData);
            sendData(healthData,"http://" + serverURI + '/health/batchData');
        }
    })
}

function encrypt(toEncrypt) {
    var wordArray = CryptoJS.lib.WordArray.random(32);
    var pkiv = CryptoJS.enc.Base64.stringify(wordArray);
    // console.log(sensor_msg);
    console.log(pkiv);
    // The AES encryption/decryption key to be used.
    var AESKey = 'aes key';
    var plain_iv = new Buffer(pkiv, 'base64').toString('hex');
    var iv = CryptoJS.enc.Hex.parse(plain_iv);
    var key = CryptoJS.enc.Hex.parse(AESKey);
    //Encrypt
    var encode_b64msg = Buffer(toEncrypt).toString('base64');
    var bytes = CryptoJS.AES.encrypt(encode_b64msg, key, { iv: iv });
    var rslt = { d: bytes.toString(), pk: pkiv }
    return rslt
}