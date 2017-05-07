var express = require('express');
var router = express.Router();
var config = require('../Config.js');
var nodemailer = require('nodemailer');
var db = require('./db.js');

/* post mail request */
router.post('/', sendCustomer);
router.post('/all', sendAll);

function sendCustomer(req, res) {

    var data = {
            EMAIL : req.body.email,
            LAST_EMAIL_SENT : new Date()
        };

    db.query('INSERT INTO USER SET ?', data, function (error, result, fields) {
        if (error) throw error;
        console.log('New customer : ' + req.body.email);
        console.log('Inserted id : ' + result.insertId);
    });

    var toEmail = req.param('email');
    var subject = 'Not-Dead-Yet...Time to Check-in!';
    var htmlContent = 'Dear ' + toEmail + ' :<br><br>Please click the link below or copy it into your browser to check-in with us and update your notify list.<br><br><a href="http://localhost:3000/checkin?email=' + toEmail +'" target="_blank" style="color:#043c3b;text-decoration:underline;display:inline-block;">Click here to check in</a><br><br>Best regrads,<br>Not-Dead-Yet Team';

    emailJob(toEmail, subject, htmlContent);
    res.send('Thanks for using our service! Please check your email for futher instruction.');
}   

function sendAll(req, res) {

    var customer = req.param('email');
    var toEmails = req.param('emails');
    var msg = req.param('message');
    var subject = 'Notification : ' + customer + ' has not checked-in';
    var htmlContent = 'Dear friend:<br><br>' + customer + 'has not checked-in with us during their check-in period. We are sending you the message below that was requested to be sent by ' + customer + ' if this happened.<br><br>' + msg + '<br><br>Best regrads,<br>Not-Dead-Yet Team';

    emailJob(toEmails, subject, htmlContent);
    res.send('Thanks for using our service! Please check your email for futher instruction.');
} 

function emailJob(toEmail, email_subject, htmlContent) {

    var transporter = nodemailer.createTransport({
        service: config.email_type,
        auth: {
            user: config.outgoing_email, // outgoing mail server
            pass: config.email_password // password
        }
    });

    var mailOptions = {
        from: config.outgoing_email, // sender address
        to: toEmail, // customer email address
        subject: email_subject, // Subject line
        //text: text //, // plaintext body
        html: htmlContent
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error);
            //res.json({yo: 'error'});
        } else{
            console.log('Message sent: ' + info.response);
            //res.json({yo: info.response});
        };
    });
}

module.exports = router





