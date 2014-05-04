var DB = require('./mysql');

function Client(){
  
}

module.exports = new Client();

Client.prototype.first = function (token, callback) {
  var sql = "SELECT * FROM ?? WHERE ?? = ?";
  var inserts = ['setting', 'valid_token', token];
  sql = DB.format(sql, inserts);

  DB.query(sql, token, function(err, rows) {
    if(err){
      return callback(err);
    }
    return callback(null, rows[0]);
    // return callback(null,rows)
  });
}

Client.prototype.all = function (callback) {
  DB.query('SELECT * FROM setting', function(err, rows) {
    if(err){
      
      console.error(err);
      return ;
    }
    // return console.log(rows);
    return callback(null, rows);
    // return callback(null,rows)
  });
}



