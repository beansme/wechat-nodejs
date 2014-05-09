var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var UserSchema = new Schema({
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
	create_date : { type: Date, default: Date.now}
});

var User = mongodb.mongoose.model("User", UserSchema);

var UserDAO = function(){};

module.exports = new UserDAO();


UserDAO.prototype.save = function(user, callback) {

  User.find({openid: user.openid}, function(err, obj){
  	if(obj.length === 0){	
  		User.create(user, function(err, userObj){
  			callback(null, 'save users');
  		});
  	}
  });

};

