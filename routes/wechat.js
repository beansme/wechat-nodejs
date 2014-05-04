var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var redis = require("redis"),
    redisClient = redis.createClient(6379, '127.0.0.1', 0);



router.param('wechat_token', function(req, res, next, wechat_token) {
    req.wechat_token = wechat_token;
    var Client = require('../model/client');
    Client.first(wechat_token, function(err, client){
    	if (err) {
  			console.log(err);
    	} else {
            if(client === undefined){
                res.writeHead(200);
                res.end();
            }
    		req.client = client;
            redisClient.incr(client.client_id+':total.message');
    		next();	
    	};
    });
    
});

router.get('/:wechat_token', wechat('token', function(req, res, next){

}));


router.post('/:wechat_token', wechat('token', wechat.text(function (message, req, res, next) {
        //test data
        var message = {ToUserName: 'gh_44e8155eca9d',FromUserName: 'o094_t0a2KTqu2OKLHgYlgoi2j_0',CreateTime: '1359125035',MsgType: 'text',Content: 'test',MsgId: '5837397576500011341'};

        var wechatKeyword = message.Content;
        var client = req.client
        var Keyword = require('../model/keyword');

        Keyword.handle(message, client, function(err, done){
            if(err) {
                console.log(err);
            }else if(!done) {
                var Reply = require('../model/reply');
                Reply.handle('text', message, req.client, function(err, done){
                    if(err){
                        console.log(err);
                    } else {
                        if(!done) {
                            redisClient.incr(client.client_id+':new.message');
                        }
                    }
                });
            } else {
            }
        });
        res.writeHead(200);
        res.end();

    }).image(function (message, req, res, next) {
        var Reply = require('../model/reply');
        Reply.handle('image', message, req.client, function(err, done){
            if(err){
                console.log(err);
            } else {
                if(!done) {
                    redisClient.incr(req.client.client_id+':new.message');
                }
            }
        });
        res.writeHead(200);
        res.end();
      // message为图片内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359124971',
      // MsgType: 'image',
      // PicUrl: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0',
      // MediaId: 'media_id',
      // MsgId: '5837397301622104395' }
    }).voice(function (message, req, res, next) {
        var Reply = require('../model/reply');
        Reply.handle('voice', message, req.client, function(err, done){
            if(err){
                console.log(err);
            } else {
                if(!done) {
                    redisClient.incr(req.client.client_id+':new.message');
                    
                }
            }
        });
        res.writeHead(200);
        res.end();
      // message为音频内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359125022',
      // MsgType: 'voice',
      // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
      // Format: 'amr',
      // MsgId: '5837397520665436492' }
    }).video(function (message, req, res, next) {
        var Reply = require('../model/reply');
        Reply.handle('location', message, req.client, function(err, done){
            if(err){
                console.log(err);
            } else {
                if(!done) {
                    redisClient.incr(req.client.client_id+':new.message');
                }
            }
        });
        res.writeHead(200);
        res.end();
      // message为视频内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359125022',
      // MsgType: 'video',
      // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
      // ThumbMediaId: 'media_id',
      // MsgId: '5837397520665436492' }
    }).location(function (message, req, res, next) {
        var Reply = require('../model/reply');
        Reply.handle('location', message, req.client, function(err, done){
            if(err){
                console.log(err);
            } else {
                if(!done) {
                    redisClient.incr(req.client.client_id+':new.message');
                }
            }
        });
        res.writeHead(200);
        res.end();
      // message为位置内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359125311',
      // MsgType: 'location',
      // Location_X: '30.283950',
      // Location_Y: '120.063139',
      // Scale: '15',
      // Label: {},
      // MsgId: '5837398761910985062' }
    }).link(function (message, req, res, next) {
        var Reply = require('../model/reply');
        Reply.handle('link', message, req.client, function(err, done){
            if(err){
                console.log(err);
            } else {
                if(!done) {
                    redisClient.incr(req.client.client_id+':new.message');
                }
            }
        });
        res.writeHead(200);
        res.end();
      // message为链接内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359125022',
      // MsgType: 'link',
      // Title: '公众平台官网链接',
      // Description: '公众平台官网链接',
      // Url: 'http://1024.com/',
      // MsgId: '5837397520665436492' }
    }).event(function (message, req, res, next) {
        var event = message.Event;
        var openid = message.FromUserName;
        var client = req.client;
        var Reply = require('../model/reply');

        if(event === 'subscribe') {
            redisClient.incr(req.client.client_id+':new.subscribe');
            var User = require('../model/user');
            var API = require('wechat').API;
            var api = new API(client.appid, client.appsecret);
            User.subscribe(openid, client.client_id, api, function(err, obj){
                if(err){
                    console.log()
                } else {
                    Reply.handle('subscribe', message, client, function(err, done){
                        if(err){
                            console.log(err);
                        } else {
                            if(done) {
                                //todo redis record
                            }
                        }
                    });
                }
            });
        }

        if(event === 'unsubscribe') {
            redisClient.incr(req.client.client_id+':new.unsubscribe');
            var User = require('../model/user');
            User.unsubscribe(openid, function(err){
                if(err){
                    console.log()
                }
            });
        }

        if(event === 'CLICK') {
           Reply.handle(message.EventKey, message, client, function(err, done){
                if(err){
                    console.log(err);
                } else {
                    if(done) {
                        //todo redis record
                    }
                }
           });
        }
        
        res.writeHead(200);
        res.end();

      // message为事件内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359125022',
      // MsgType: 'event',
      // Event: 'LOCATION',
      // Latitude: '23.137466',
      // Longitude: '113.352425',
      // Precision: '119.385040',
      // MsgId: '5837397520665436492' }
    })));






//****
//
//test local
//
//***** 

router.get('/:wechat_token', function(req, res){

    var message = {ToUserName: 'gh_44e8155eca9d',FromUserName: 'o094_t0a2KTqu2OKLHgYlgoi2j_0',CreateTime: '1359125035',MsgType: 'text',Content: 'test',MsgId: '5837397576500011341'};
    // var message = {ToUserName: 'gh_44e8155eca9d',FromUserName: 'o094_t0a2KTqu2OKLHgYlgoi2j_0',CreateTime: '1359125035',MsgType: 'event',Event: 'unsubscribe'};
    var wechatKeyword = message.Content;

    var Keyword = require('../model/keyword');



    // var event = message.Event;
    var openid = message.FromUserName;
    var client = req.client;

    // if(event === 'subscribe') {
    //     var User = require('../model/user');
    //     var API = require('wechat').API;
    //     var api = new API(client.appid, client.appsecret);
    //     User.subscribe(openid, client.client_id, api, function(err, obj){
    //         if(err){
    //             console.log()
    //         }
    //     });
    // }

    // if(event === 'unsubscribe') {
    //     var User = require('../model/user');
    //     User.unsubscribe(openid, function(err){console.log(err)});
    // } 

    if(message.MsgType === 'text') {
        Keyword.handle(message, client, function(err, done){
            if(!done) {
                var Reply = require('../model/reply');
                Reply.handle('text', message, req.client, function(){});
            }
        });
        // Keyword.handle(message, client, function(){});
        res.writeHead(200);
        res.end();
        // Keyword.findByKeyword(wechatKeyword, client.client_id, function(err, keywords){
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         var is_reply = 1;
        //         if(keywords.length === 0){
        //             is_reply = 0;
        //             saveMessage(message, is_reply);
        //         } else {
        //            // var API = require('wechat').API;
        //            // var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
        //            // var api = new API(client.appid, client.appsecret);
        //            var openid = message.FromUserName;
        //            var media = new Array();
        //            media.text = new Array();
        //            for(var i = 0; i < keywords.length; i++){
        //                //所有待回复文字合并为数组
        //                media.text = media.text.concat(keywords[i].media.text);
        //            }
        //            replyMeida(client, openid, media); 
        //         }

        //         res.writeHead(200);
        //         res.end();
        //     }
        // });
    }

   
});


router.get('/', function(req, res) {
    var redis = require("redis"),
        client = redis.createClient(6379, '127.0.0.1', 0);
     

    /*插入数据*/
        if(client.exists('view')){
            client.incrby('view', 1);
            console.log(client.exists('view'));
        } else {
            console.log('set');
            client.set('view', 1);
        }

        client.get('view', function(err, result){

                res.send(result);
        });
    // var API = require('wechat').API;
    // var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
    // api.getUser('o094_t0a2KTqu2OKLHgYlgoi2j_0', function(err, result){
    //     if(err)
    //         console.log(err);
    //     else 
    //         res.send(result);
    // });
    // 
    // api.sendText('o094_t0a2KTqu2OKLHgYlgoi2j_0', "hello", function(err, result){
    //     if(err)
    //         console.log(err);
    //     else 
    //         res.send(result);
    // });
    // api.list();
});



/**
 * end loacl test
 */







module.exports = router;
