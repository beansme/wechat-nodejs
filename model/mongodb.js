// var mongoose = require('mongoose')
//     ,setting = require.('../config/database').mongodb;

// module.exports = mongoose.connect('mongodb://'+setting.host+':'+setting.port+'/'+setting.db+'');


// var Db = require('mongodb').Db,
//     MongoClient = require('mongodb').MongoClient,
//     Server = require('mongodb').Server,
//     setting = require('../config/database').mongodb;

//   // Set up the connection to the local db
//   module.exports = new MongoClient(new Server(setting.host, setting.port), {native_parser: true});


var mongoose = require('mongoose')
		,setting = require('../config/database').mongodb;

mongoose.connect('mongodb://'+setting.host+':'+setting.port+'/'+setting.db);
exports.mongoose = mongoose;

