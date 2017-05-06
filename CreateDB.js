var config = require('./Config.js');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});

// DROP database if exist to make sure create clean new db
var queryString = 'DROP DATABASE IF EXISTS ' + config.db +
    ';CREATE DATABASE ' + config.db;

let p1 = new Promise((resolve, reject) => {

    connection.query(queryString, (err, result) => {
      if (err) {
        // Reject the Promise with an error
        return reject(err)
      }
      console.log('Created DATABASE ' + config.db);
      // Resolve (or fulfill) the promise with data
      return resolve(result)
    })
  })

p1.then (
      function(val) {
            let conn = mysql.createConnection({
              host     : config.host,
              user     : config.user,
              password : config.password,
              database : config.db
            });
            conn.query('CREATE TABLE USER(' + 
                'ID INT AUTO_INCREMENT,' + 
                'EMAIL VARCHAR(255) NOT NULL,' +
                'LAST_CHECK_IN TIMESTAMP NOT NULL DEFAULT 0,' +
                'LAST_EMAIL_SENT TIMESTAMP NOT NULL DEFAULT 0,' +
                'NOTIFY_LIST VARCHAR(2550),' +
                'MESSAGE VARCHAR(2550),' + 
                'PRIMARY KEY (ID));', function (error, results, fields) {
              if (error) throw error;
              console.log('Created table Customers!');
            });
            conn.end();
        }

   )
  .catch(err => {
    // handle errors
  })

connection.end();