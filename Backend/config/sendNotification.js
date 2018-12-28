const Notification = require('../models/Notification_model');
const nodemailer = require('nodemailer');



const accountSid = 'paste here account id';
const authToken = 'paste here account token';
const smsClient = require('twilio')(accountSid, authToken);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'enter email address here',
        pass: 'enter password here'
    }
});

checkNotofi = function checkNotification() {
    Notification.getNewNotification((err, resp) => {
        console.log(resp)
        resp.forEach(notifi => {
            if (notifi.type == 'email') {
                var mailOptions = {
                    from: 'email address',
                    to: notifi.to,
                    subject: 'AQMS Alert',
                    text: notifi.data
                };
                // console.log(mailOptions);
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        Notification.updateStatus(notifi._id, (err, resp) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log(resp);
                                console.log("Notification Updated.")
                            }
                        })
                    }
                });
            }
            else if (notifi.type == 'sms') {
                //SMS Code
                
                // smsClient.messages
                //     .create({
                //         body: notifi.data,
                //         from: 'enter given service number',
                //         to: 'enter phonenumber'//+notifi.to
                //     })
                //     .then(message => console.log(message.sid))
                //     .done();
            }

        });
    });
}





module.exports = checkNotofi;