var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var MessageSchema = new Schema({

	ToUserName: String,
	FromUserName: String,
	CreateTime: String,
	MsgType: String,
	Content: String, //text
	PicUrl: String, //pic
	Format: String, //voice
	ThumbMediaId : String, //video
	Location_X: String, //location
  Location_Y: String,
  Scale: String,
  Label: String,
 	Title: String,
  Description: String,
  Url: String,
  MediaId: String,
	MsgId: String,
	Status: Number,
	create_date : { type: Date, default: Date.now}
});

var Message = mongodb.mongoose.model("Message", MessageSchema);

var MessageDAO = function(){};

module.exports = new MessageDAO();


MessageDAO.prototype.save = function(message, callback) {
  Message.create(message, function(err, obj){
    callback(err, obj);
  });

};

MessageDAO.prototype.reply = function(client, openid, meida, callback) {
	var isArray = function(obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]';
	}

	var replyText = function(api, openid, text){
	    if(!isArray(text)){
	        return api.sendText(openid, text.content, function(){});
	    }
	    if(text.length > 0){
	        api.sendText(openid, text[0].content, function(){
	            return replyText(api, openid, text.slice(1,text.length));
	        });
	    } else {
	        return ;
	    }
	}

	var API = require('wechat').API;
	var api = new API(client.appid, client.appsecret);
	var text = meida.text;
	replyText(api, openid, text);
}
