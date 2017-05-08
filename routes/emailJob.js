var express = require('express');
var router = express.Router();
var config = require('../Config.js');
var nodemailer = require('nodemailer');
var db = require('./db.js');
var stripe = require("stripe")(config.API_key);

/* post mail request */
router.post('/', newCustomer);

// verify new customer email and insert his email to database
function newCustomer(req, res) {

    function validate(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    var userEmail = req.body.email.trim();
    if (validate(userEmail)) { 

        // Create a new customer and then a new charge for that customer:
        stripe.customers.create({
          email: userEmail
        }).then(function(customer){
          return stripe.customers.createSource(customer.id, {
            source: {
               object: 'card',
               exp_month: req.body.month,
               exp_year: req.body.year,
               number: req.body.card,
               cvc: req.body.cvc
            }
          });
        }).then(function(source) {
          return stripe.charges.create({
            amount: 500,
            currency: 'usd',
            customer: source.customer
          });
        }).then(function(charge) {
            db.query('SELECT * FROM USER WHERE EMAIL = "' + userEmail + '"', function (error, result, fields) {
                if (error) throw error;
                if (result.length > 0) {
                    console.log('SQL: Found duplicated email, reject insert info to database');
                    res.send('This email has been registered! Please enter a new one.<br/><a href="javascript:history.back()">Go Back</a>');
                    duplicated = true;
                } else {
                    var data = {
                        EMAIL : userEmail
                    };
                    db.query('INSERT INTO USER SET ?', data, function (error, result, fields) {
                        if (error) throw error;
                        console.log('SQL: Inserted new customer : ' + req.body.email);
                        console.log('SQL: Inserted id : ' + result.insertId);
                    });
                    res.send('Thanks for using our service! Please check your email for futher instruction.<br/><a href="javascript:history.back()">Go Back</a>'); 
                    }
            });
        }).catch(function(err) {
          // Deal with an error
          console.log("Error: Credit card number is incorrect.");
          res.send('Oops! Your credit card information is incorrect!<br/><a href="javascript:history.back()">Go Back</a>');
        });


    } else {
        res.send('Wrong input! Please enter correct info.<br/><a href="javascript:history.back()">Go Back</a>');
    }
}

// set email job frequency in Config.js file
setInterval(emailJob, config.email_job_frequency);

// handle all email jobs
function emailJob() {
    console.log("====================== EmailJob ======================");
    console.log("Checking database... in frequency " + config.email_job_frequency + "ms" );

    var queryString = 'SELECT * FROM USER WHERE LAST_CHECK_IN = "0000-00-00 00:00:00" AND LAST_EMAIL_SENT = "0000-00-00 00:00:00"';
    db.query(queryString, function (error, result, fields) {
        if (error) throw error;
        if (result.length > 0) {
            console.log('Found new user : ');
            for (var i = 0, len = result.length; i < len ; i++) {
                console.log(result[i]['EMAIL']);
                sendCustomer(result[i]['EMAIL']);
            }
        }
    });

    var queryString = 'SELECT * FROM USER WHERE LAST_CHECK_IN != "0000-00-00 00:00:00" AND LAST_CHECK_IN < LAST_EMAIL_SENT AND (CURRENT_TIMESTAMP - LAST_EMAIL_SENT) > ' + config.notify_delay / 1000;

    db.query(queryString, function (error, result, fields) {
        if (error) throw error;
        if (result.length > 0) {
            console.log('Found users missed the check in : ');
            for (var i = 0, len = result.length; i < len ; i++) {
                console.log(result[i]['EMAIL'] + " this user is dead! Notify Let-Know to all emails...");
                sendAll(result[i]['EMAIL'], result[i]['NOTIFY_LIST'], result[i]['MESSAGE']);
            }
        }
    });

    var queryString = 'SELECT * FROM USER WHERE LAST_EMAIL_SENT != "0000-00-00 00:00:00" AND LAST_EMAIL_SENT < LAST_CHECK_IN AND (CURRENT_TIMESTAMP - LAST_CHECK_IN) > ' + config.check_in_frequency / 1000;
    db.query(queryString, function (error, result, fields) {
        if (error) throw error;
        if (result.length > 0) {
            console.log('Found users that they need to check in : ');
            for (var i = 0, len = result.length; i < len ; i++) {
                console.log(result[i]['EMAIL'] + " is time to check in!");
                sendCustomer(result[i]['EMAIL']);
            }
        }
    });
}

// send check in link to user
function sendCustomer(toWho) {

    var subject = 'Not-Dead-Yet...Time to Check-in!';
    var htmlContent = 'Dear ' + toWho + ' :<br><br>Please click the link below or copy it into your browser to check-in with us and update your notify list.<br><br><a href="' + config.host + ':3000/checkin?email=' + toWho + '" target="_blank" style="color:#043c3b;text-decoration:underline;display:inline-block;">' + config.host + ':3000/checkin?email=' + toWho + '</a><br><br>Best regrads,<br>Not-Dead-Yet Team';

    emailTo(toWho, subject, htmlContent);
    var data = {
        LAST_EMAIL_SENT : new Date()
    };
    db.query('UPDATE USER SET ?', data, function (error, result, fields) {
        if (error) throw error;
        console.log('SQL: '+ toWho + ' LAST_EMAIL_SENT has been updated!' );
    });
} 

// notify Let-Know to user's email list
function sendAll(customer, toWhos, msg) {

    var subject = 'Notification : ' + customer + ' has not checked-in';
    var htmlContent = 'Dear friend:<br><br>' + customer + ' has not checked-in with us during their check-in period. We are sending you the message below that was requested to be sent by ' + customer + ' if this happened.<br><br>Here is the message:<br>' + msg + '<br><br>Best regrads,<br>Not-Dead-Yet Team';

    emailTo(toWhos, subject, htmlContent);
} 

// nodemailer script
function emailTo(toWho, email_subject, htmlContent) {

    var transporter = nodemailer.createTransport({
        service: config.email_type,
        auth: {
            user: config.outgoing_email, // outgoing mail server
            pass: config.email_password // password
        }
    });

    var mailOptions = {
        from: config.outgoing_email, // sender address
        to: toWho, // customer email address
        subject: email_subject, // Subject line
        //text: text //, // plaintext body
        html: htmlContent
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error);
            //res.json({yo: 'error'});
        } else{
            console.log('Email sent: ' + info.response);
            //res.json({yo: info.response});
        };
    });
}

module.exports = router





