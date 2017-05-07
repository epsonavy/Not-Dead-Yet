var express = require('express');
var router = express.Router();
var db = require('./db.js');


/* POST save customer data */
router.post('/save', function(req, res, next) {

    function validate(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    var email_list_validated = true;
    var x = req.body.emails;
    if(x.match(",")) {
        var emails = x.split(",");
        emails.forEach(function (email) {
            if (!validate(email.trim())) {
                email_list_validated = false;
            }
        });
    } else {
        if (!validate(x.trim())) {
            email_list_validated = false;
        }
    }

    if (validate(req.body.email) && email_list_validated ) { 
        var data = {
            EMAIL : req.body.email,
            NOTIFY_LIST : req.body.emails,
            LAST_CHECK_IN : new Date(),
            LAST_EMAIL_SENT : new Date(),
            MESSAGE : req.body.message
        };

        db.query('SELECT LAST_CHECK_IN FROM USER WHERE EMAIL = "' + req.body.email + '"', function (error, result, fields) {
            if (error) throw error;
            console.log('SQL Found result : ' + JSON.stringify(result[0]));
            if (result[0]['LAST_CHECK_IN'] == "0000-00-00 00:00:00") {
                res.send('Saved! This is your first tiem to check-in');
            } else {
                res.send('Saved! Your last check-in was:' + result[0]['LAST_CHECK_IN']);
            }
        });

        db.query('UPDATE USER SET ?', data, function (error, result, fields) {
            if (error) throw error;
            console.log('USER got updated LAST_CHECK_IN...');
        });

    } else {
        res.send('Wrong input! Please enter correct email.');
    }

    
});

/* post mail request 
router.post('/send', email.sendEmail);

function handleMail(req, res) {

    db.connection.query('INSERT INTO Customers SET ?', {user_email: req.param(email)}, function (error, results, fields) {
      if (error) throw error;
      console.log('Inserted id : ' + result.insertId);
    });

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
        html: 'Dear ' + req.param('email') + ' :<br><br>Please click the link below or copy it into your browser to check-in with us and update your notify list.<br><br><a href="http://localhost:3000/checkin" target="_blank" style="color:#043c3b;text-decoration:underline;display:inline-block;">Click here to check in</a><br><br>Best regrads,<br>Not-Dead-Yet Team'
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
*/

/* GET checkin page. */
router.get('/checkin', function(req, res, next) {
  res.render('checkin', { email: req.param('email')});
});

module.exports = router