
var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var ReplySchema = new Schema({
client_id : String,
reply_key: String,
media : {
  text: [{content: String}],
  news: [{media_id:String}]
},
create_date : { type: Date, default: Date.now},
});

var Reply = mongodb.mongoose.model("Reply", ReplySchema);

var ReplyDAO = function(){};

module.exports = new ReplyDAO();


ReplyDAO.prototype.find = function(name, client_id, callback) {

  Reply.find({reply_key: name, client_id:client_id}, function(err, obj){
    callback(err, obj);
  });

};


ReplyDAO.prototype.handle = function(reply_key, message, client, callback) {

  Reply.find({reply_key: reply_key, client_id:client.client_id}, function(err, result){
  	if (err) {
  	    console.log(err);
  	} else {
    		var Message = require('../model/message');
  	    if(result.length === 0){
  	        var is_reply = 0;
  	        Message.save(message, is_reply, function(err, obj){if(err) console.log(err);}); // save message if it's not auto reply
  	    		callback(null, null);
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
    // callback(err, obj);
  });

};

