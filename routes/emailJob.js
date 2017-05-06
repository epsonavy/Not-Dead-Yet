var express = require('express');
var router = express.Router();
var config = require('../Config.js');
var nodemailer = require('nodemailer');
var db = require('./db.js');

/* post mail request */
router.post('/', emailJob);

function emailJob(req, res) {

    /*
    db.query('INSERT INTO USER SET ?', {EMAIL: req.param(email)}, function (error, results, fields) {
      if (error) throw error;
      console.log('Inserted id : ' + result.insertId);
    });*/
    console.log(req.param('email'));

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'epso2017@gmail.com', // current working web master email
            pass: '789789789' // password
        }
    });

    var mailOptions = {
        from: 'epso2017@gmail.com', // sender address
        to: req.param('email'), // customer email address
        subject: 'Not-Dead-Yet...Time to Check-in!', // Subject line
        //text: text //, // plaintext body
        html: 'Dear ' + req.param('email') + ' :<br><br>Please click the link below or copy it into your browser to check-in with us and update your notify list.<br><br><a href="http://localhost:3000/checkin?email=' + req.param('email') +'" target="_blank" style="color:#043c3b;text-decoration:underline;display:inline-block;">Click here to check in</a><br><br>Best regrads,<br>Not-Dead-Yet Team'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error);
            res.json({yo: 'error'});
        } else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
}

/*
exports.getAll = function (callback) {
    connection.connect(function () {
        connection.query('SELECT * FROM Customers', function (err, result) {
            if(!err){
                callback(result);
            }
        });
    });
};*/

module.exports = router





