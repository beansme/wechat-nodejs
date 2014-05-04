var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = '__q59iBELMFLjmIqkWni3ExDert-o-gYDuOPma59';
qiniu.conf.SECRET_KEY = 'VxVC_Xi8dU3Kx-QKKBuTVWx0q3U_RmaSn_OkRpJh';

var bucketname = 'competition-2014';
function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  putPolicy.callbackUrl = '/qiniu/callback';
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  //putPolicy.asyncOps = asyncOps;
  //putPolicy.expires = expires;

  return putPolicy.token();
}