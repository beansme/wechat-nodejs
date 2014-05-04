// var mongoclient = require('./mongodb');

// function Keyword() {
  
// };

// module.exports = Keyword;



// Keyword.prototype.get = function(name, client_id, callback) {
//   // Open the connection to the server
//   mongoclient.open(function(err, mongoclient) {
//     if (err) { 
//       mongoclient.close();
//       return callback(err);//错误，返回 err 信息
//     }
//     // Get the first db and do an update document on it
//     var db = mongoclient.db("wechat");
//     db.collection('keywords').find({keywords: name, client_id: client_id}).toArray(function(err, result) {
//         mongoclient.close();
//         if (err) {
//           return callback(err);//错误，返回 err 信息
//         }
//         callback(null, result);
//       });
//   });
//   };



// Keyword.prototype.get = function(name, callback) {
//   mongodb.open(function (err, db) {
//     if (err) {
//       return callback(err);//错误，返回 err 信息
//     }
//     //读取 users 集合
//     db.collection('keywords', function (err, collection) {
//       if (err) {
//         mongodb.close();
//         return callback(err);//错误，返回 err 信息
//       }
//       //将用户数据插入 users 集合
//       collection.find({keywords: name}, function (err, keywords) {
//         mongodb.close();
//         if (err) {
//           return callback(err);//错误，返回 err 信息
//         }
//         callback(null, keywords);//成功！err 为 null，并返回存储后的用户文档
//       });
//     });
//   });
// };



var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var KeywordSchema = new Schema({
client_id : String,
keywords: [String],
media : {
  text: [{content: String}],
  news: [{media_id:String}]
},
create_date : { type: Date, default: Date.now},
});

var Keyword = mongodb.mongoose.model("Keyword", KeywordSchema);

var KeywordDAO = function(){};

module.exports = new KeywordDAO();


// KeywordDAO.prototype.findByKeyword = function(name, client_id, callback) {

//   Keyword.find({keywords: name, client_id:client_id}, function(err, obj){
//     callback(err, obj);
//   });

// };



KeywordDAO.prototype.handle = function(message, client, callback) {

  Keyword.find({keywords: message.Content, client_id:client.client_id}, function(err, result){
  	if (err) {
  	    console.log(err);
  	} else {
    		var Message = require('../model/message');
  	    if(result.length === 0){
  	        var is_reply = 0;
            callback(null, null);
  	        Message.save(message, is_reply, function(err, obj){if(err) console.log(err);}); // save message if it's not auto reply
  	    } else {

  	        // var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
  	        var openid = message.FromUserName;
  	        var media = new Array();
  	        media.text = new Array();
  	        for(var i = 0; i < result.length; i++){
  	            //所有待回复文字合并为数组
  	            media.text = media.text.concat(result[i].media.text);
  	            //todo add news
  	        }
  	        Message.reply(client, openid, media, function(){});
            callback(null, true);
  	    }
  	   
  	}
    
  });

};



