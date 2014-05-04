var setting = require('../config/database').mysql;
var mysql    = require('mysql');


module.exports = mysql.createConnection({
  host     : setting.host,
  user     : setting.user,
  password : setting.password,
  database : setting.database
});