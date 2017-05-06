var express = require('express');
var router = express.Router();
var config = require('../Config.js');
var nodemailer = require('nodemailer');
var db = require('./db.js');

/* post mail request */
router.post('/', sendCustomer);

function sendCustomer(req, res) {

    var toEmail = req.param('email');
    var subject = 'Not-Dead-Yet...Time to Check-in!';
    var htmlContent = 'Dear ' + toEmail + ' :<br><br>Please click the link below or copy it into your browser to check-in with us and update your notify list.<br><br><a href="http://localhost:3000/checkin?email=' + toEmail +'" target="_blank" style="color:#043c3b;text-decoration:underline;display:inline-block;">Click here to check in</a><br><br>Best regrads,<br>Not-Dead-Yet Team';

    emailJob(toEmail, subject, htmlContent);
    res.send('Thanks for using our service! Please check your email for futher instruction.');
}   

function emailJob(toEmail, email_subject, htmlContent) {

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'epso2017@gmail.com', // web master email
            pass: '789789789' // password
        }
    });

    var mailOptions = {
        from: 'epso2017@gmail.com', // sender address
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





