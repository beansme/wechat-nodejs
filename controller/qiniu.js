var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = '__q59iBELMFLjmIqkWni3ExDert-o-gYDuOPma59';
qiniu.conf.SECRET_KEY = 'VxVC_Xi8dU3Kx-QKKBuTVWx0q3U_RmaSn_OkRpJh';
var bucketname = 'competition-2014';

var Qiniu = function() {
  	var putPolicy = new qiniu.rs.PutPolicy(bucketname);
	  // putPolicy.callbackUrl = ;
	  // putPolicy.callbackBody = callbackBody;
	  // putPolicy.returnUrl = '/qiniu/callback';
	  // putPolicy.returnBody = 'key=$(key)&hash=$(etag)';
	  //putPolicy.asyncOps = asyncOps;
	  //putPolicy.expires = expires;
	  
	  this.uptoken = putPolicy.token();
}

Qiniu.prototype.upload = function(body, key, uptoken, callback) {
  var extra = new qiniu.io.PutExtra();
  //extra.params = params;
  //extra.mimeType = mimeType;
  //extra.crc32 = crc32;
  //extra.checkCrc = checkCrc;
  uptoken = uptoken || Qiniu.uptoken;
  qiniu.io.put(uptoken, key, body, extra, function(err, ret) {
    if (!err) {
      // 上传成功， 处理返回值
      callback(err, ret);
      // ret.key & ret.hash
    } else {
      // 上传失败， 处理返回代码
      callback(err, ret);
      // http://developer.qiniu.com/docs/v6/api/reference/codes.html
    }
  });
}

module.exports = new Qiniu();