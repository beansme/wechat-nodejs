var express = require('express');
var router = express.Router();
var qiniu = require('../controller/qiniu');
/* GET users listing. */
router.get('/', function(req, res) {
	var API = require('wechat').API;
	var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
	api.getMedia('2AFTZKiM-tmhGkPSxM0uaifF1NsgqWyU-FPFdH4_O8Sh3cMSU8ipoN0zni3w-n4l', function(err, result){
  	qiniu.upload(result, null, qiniu.uptoken, function(err, ret){
  		console.log(err);
  		console.log(ret);
  	});
	});
 });

router.get('/callback', function(req,res){
	console.log(req);
});

module.exports = router;
