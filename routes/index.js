var express = require('express');
var router = express.Router();
var db = require('./db.js');

/* POST save customer data */
router.post('/save', function(req, res, next) {
    var data = {
        EMAIL : req.param('email'),
        NOTIFY_LIST : req.param('emails'),
        LAST_CHECK_IN : Date.now(),
        LAST_EMAIL_SENT : Date.now(),
        MESSAGE : req.param('message')
    };

    db.query('INSERT INTO USER SET ?', data, function (error, result, fields) {
      if (error) throw error;
      console.log('Inserted id : ' + result.insertId);
    });

    res.send('Your information has been recorded!');
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