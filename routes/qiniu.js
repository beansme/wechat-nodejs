var express = require('express');
var router = express.Router();

router.get('/callback', function(req, res, next){
	res.send('callback');
});





module.exports = router;