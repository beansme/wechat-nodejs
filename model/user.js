var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var UserSchema = new Schema({
 subscribe: Number, 
 client_id : String, 
 openid: String, 
 nickname: String, 
 sex: Number, 
 language: String, 
 city: String, 
 province: String, 
 country: String, 
 headimgurl: String,
 subscribe_time: Number,
create_date : { type: Date, default: Date.now}
});

var User = mongodb.mongoose.model("User", UserSchema);

var UserDAO = function(){};

module.exports = new UserDAO();


UserDAO.prototype.subscribe = function(openid, client_id, api, callback) {

  User.find({openid: openid}, function(err, obj){
  	if(obj.length === 0){
  		api.getUser(openid, function(err, user){
				if(err){
					console.log(err);
					callback(err, obj);
				} else {
					User.create(user, function(err, userObj){
						callback(null, userObj);
					});
				}
  		});
    
  	} else {
  		obj.subscribe = 1;
  		obj.save(function(err){});
  		callback(null, obj);
  	}
  });

};


UserDAO.prototype.unsubscribe = function(openid, callback) {
	User.update({openid: openid}, {$set: {subscribe: 0}}, function(err){
		callback(err);
	});
};