var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema,
		ObjectId = Schema.ObjectId;
var PostSchema = new Schema({
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
					return callback(err, obj);
				});
			}
		});
};

PostDAO.prototype.saveImage = function(_id, type, media_id, callback){
	Article.findOne({_id: _id}, function(err, obj){
		var API = require('wechat').API;
		var qiniu = require('../controller/qiniu');
		var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
		api.getMedia(media_id, function(err, result){
			qiniu.upload(result, null, qiniu.uptoken, function(err, ret){
				if(err){
					console.log(err);
				} else {
					// console.log(ret);
					var qiniu_url = 'http://competition-2014.qiniudn.com';
					var link = qiniu_url + '/' + ret.key + '?imageView2/1/w/320/h/200';
					if(type === 'banner') {
						obj.img = link;
						console.log(link);
					} else {
						obj.content = obj.content + '<p><img width="100%" src="' + link + '"></p>';
					}
						// Post.update({_id: _id}, {$push: {content:['image', link]}} ,function(err, obj){
								
						// });
					// }
					obj.save(function(){console.log('save image')});
					return callback(err, link);
				}
			});
		});
	});
};

PostDAO.prototype.saveContent = function(_id, content, callback){
	Article.findOne({_id: _id}, function(err, obj){
		obj.content = obj.content + '<p>' + content +  '</p>';
		obj.save(function(){console.log('save content')});
		return callback(err, obj);
	});
	// Post.update({_id: _id}, {$push: {content:['text', content]}} ,function(err, obj){
	// 	callback(err, obj);
	// });
};


PostDAO.prototype.done = function(_id, callback){
	Article.findOne({_id: _id}, function(err, obj){
		obj.done = 1;
		obj.save(function(){});
		return callback(null, obj);
	});

	
}