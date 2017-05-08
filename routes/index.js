var express = require('express');
var router = express.Router();
var db = require('./db.js');
var config = require('../Config.js');

/* POST save customer data */
router.post('/save', function(req, res, next) {

    function validate(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    var email_list_validated = true;
    var userEmail = req.body.emails;
    if(userEmail.match(",")) {
        var emails = userEmail.split(",");
        emails.forEach(function (email) {
            if (!validate(email.trim())) {
                email_list_validated = false;
            }
        });
    } else {
        if (!validate(userEmail.trim())) {
            email_list_validated = false;
        }
    }

    if (validate(userEmail.trim()) && email_list_validated ) { 

        var data = {
            EMAIL : req.body.email,
            NOTIFY_LIST : req.body.emails,
            LAST_CHECK_IN : new Date(),
            MESSAGE : req.body.message
        };

        db.query('SELECT LAST_CHECK_IN FROM USER WHERE EMAIL = "' + req.body.email + '"', function (error, result, fields) {
            if (error) throw error;
            console.log('SQL: Found result : ' + JSON.stringify(result[0]));
            if (result[0]['LAST_CHECK_IN'] == "0000-00-00 00:00:00") {
                res.send('Saved! This is your first time to check-in');
                res.send('Your last check-in was:' + result[0]['LAST_CHECK_IN']);
            } else {
                res.send('Saved! Your last check-in was:' + result[0]['LAST_CHECK_IN']);
            }
        });

        db.query('UPDATE USER SET ?', data, function (error, result, fields) {
            if (error) throw error;
            console.log('SQL: '+ req.body.email + ' LAST_CHECK_IN has been updated!' );
            console.log(req.body.email + ' check in successful!');
        });

    } else {
        res.send('Wrong input! Please enter correct email.');
    }

    
});

/* GET checkin page. */
router.get('/checkin', function(req, res, next) {
  res.render('checkin', { email: req.param('email')});
});

module.exports = router