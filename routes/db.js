var config = require('../Config.js');
var mysql = require('mysql');
var db = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.db,
  multipleStatements: true
});

exports.getTable = function () {

  let p1 = new Promise((resolve, reject) => {

    db.query('SELECT * FROM USER', (err, result) => {
      if (err) {
        // Reject the Promise with an error
        return reject(err)
      }
      console.log('SELECTed DATA');
      // Resolve (or fulfill) the promise with data
      return resolve(result)
    })
  })

  p1.then (
      function(val) {
        console.log(val);
        return val;
      }

   )
  .catch(err => {
    // handle errors
  })

  db.end();
};

exports.getAll = function (callback) {
    db.connect(function () {
        db.query('SELECT * FROM Customers', function (err, result) {
            if(!err){
                callback(result);
            }
        });
    });
};

exports.getLists = function (email, callback) {
    db.connect(function () {
        db.query('SELECT email_list FROM Customers WHERE user_email =' + email, function (err, result) {
            if(!err){
                callback(result);
            }
        });
    });
};

module.exports = db;