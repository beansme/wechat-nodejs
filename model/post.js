var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema,
		ObjectId = Schema.ObjectId;
var PostSchema = new Schema({
	post_id: ObjectId,
	title: String,
	banner: String,
	content: [{part: String}],
	author: {
		subscribe: Number, 
		openid: String, 
		nickname: String, 
		sex: Number, 
		language: String, 
		city: String, 
		province: String, 
		country: String, 
		headimgurl: String,
		subscribe_time: Number,
	},

	create_date : { type: Date, default: Date.now}
});

var Post = mongodb.mongoose.model("Post", PostSchema);

var PostDAO = function(){};

module.exports = new PostDAO();


PostDAO.prototype.saveTitle = function(title, openid, callback) {
		var API = require('wechat').API;
		var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
		api.getUser(openid, function(err, user){
			if(err){
				console.log(err);
			} else {
				Post.create({'title': title, author: user}, function(err, obj){
					callback(err, obj);
				});
			}
		});
};

PostDAO.prototype.saveImage = function(post_id, type, media_id, callback){
	Post.find({post_id: post_id}, function(err, obj){
		var API = require('wechat').API;
		var qiniu = require('../controller/qiniu');
		var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
		api.getMedia(media_id, function(err, result){
			qiniu.upload(result, null, qiniu.uptoken, function(err, ret){
				if(err){
					console.log(err);
				} else {
					console.log(ret);
					var qiniu_url = '';
					var link = qiniu_url + ret.key;
					if(type === 'banner') {
						obj[0].banner = link;
					} else {
						obj[0].content.push(link);
					}
					obj[0].save();
					callback(err, link);
				}
			});
		});
	});
};

PostDAO.prototype.saveContent = function(post_id, content, callback){
	Post.find({post_id: post_id}, function(err, obj){
		obj[0].content.push(content);
	});
};