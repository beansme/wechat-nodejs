var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema,
		ObjectId = Schema.ObjectId;
var PostSchema = new Schema({
	post_id: ObjectId,
	title: String,
	img: String,
	content: { type: String, default: ''},
	user: {
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
	done: {type: Number, default: 0},
	create_date : { type: Date, default: Date.now}
});

var Article = mongodb.mongoose.model("Article", PostSchema);

var PostDAO = function(){};

module.exports = new PostDAO();


PostDAO.prototype.saveTitle = function(title, openid, callback) {
		var API = require('wechat').API;
		var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
		api.getUser(openid, function(err, user){
			if(err){
				console.log(err);
			} else {
				Article.create({'title': title, user: user}, function(err, obj){
					callback(err, obj);
				});
			}
		});
};

PostDAO.prototype.saveImage = function(post_id, type, media_id, callback){
	Article.findOne({post_id: post_id}, function(err, obj){
		var API = require('wechat').API;
		var qiniu = require('../controller/qiniu');
		var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
		api.getMedia(media_id, function(err, result){
			qiniu.upload(result, null, qiniu.uptoken, function(err, ret){
				if(err){
					console.log(err);
				} else {
					// console.log(ret);
					var qiniu_url = 'competition-2014.qiniudn.com';
					var link = qiniu_url + '/' + ret.key;
					console.log(obj);
					if(type === 'banner') {
						obj.img = link;
					} else {
						obj.content = obj.content + '<p><img src="' + link + '"></p>';
					}
						// Post.update({post_id: post_id}, {$push: {content:['image', link]}} ,function(err, obj){
								
						// });
					// }
					obj.save(function(){});
					callback(err, link);
				}
			});
		});
	});
};

PostDAO.prototype.saveContent = function(post_id, content, callback){
	Article.findOne({post_id: post_id}, function(err, obj){
		obj.content = obj.content + '<p>' + content +  '</p>';
		obj.save(function(){});
	});
	// Post.update({post_id: post_id}, {$push: {content:['text', content]}} ,function(err, obj){
	// 	callback(err, obj);
	// });
};


PostDAO.prototype.done = function(post_id, callback){
	Article.update({post_id: post_id}, {$set: {done: 1}}, function(err, obj){
		callback(err, obj);
	});
}