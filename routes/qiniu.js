var express = require('express');
var router = express.Router();

router.get('/callback', function(req, res, next){
	console.log(req);
});






module.exports = router;