var express = require('express');
var router = express.Router();
var wechat = require('wechat');




/**
 * [description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
router.get('/:wechat_token', wechat('szu_token', function(req, res, next){

}));




/**
 * test
 */

// router.use(wechat('szu_token', function (req, res, next) {
//     var message = req.weixin;
//     console.log(message);
//     if (typeof(req.wxsession.postmode) !=='undefined' && req.wxsession.postmode === 1) {
//         if(typeof(req.wxsession.postbanner) !=='undefined' && req.wxsession.postbanner === 1 ) {
//             //正文
//             if(info.MsgType === 'text') {
               
//                 if(info.Content === '完成') {
//                   //store post
//                   res.reply('完成，url');
//                 } else if (info.Content === '取消') {
//                   req.wxsession.postmode = 0;
//                   res.reply('已取消');
//                 } else {
//                     //处理文字
//                 }
//             } else if(info.MsgType === 'image') {
//                 req.wxsession.postbanner = 1
//                 res.reply('请输入正文');
//                 //处理图片
//             }
          
//         } else {
//             if(message.MsgType === 'image') {
//                 //处理banner图片
//             } else {
//                 res.reply('发送图片或 取消 ');
//             }
//         }
//     }

//     next();

// }));

/**
 * end test
 */



router.post('/:wechat_token', wechat('szu_token', wechat.text(function (message, req, res, next) {
        console.log(req.wxsession);
        var Post = require('../model/post');
        if(req.wxsession.postmode === 1) {
            if (message.Content === '取消') {
                req.wxsession.postmode = 0;
                req.wxsession.postbanner = 0;
                req.wxsession.posttitle = 0;
                res.reply('已取消');
            } else {
                if(req.wxsession.posttitle === 0){
                    //store title
                    var title = message.Content;
                    req.wxsession.posttitle = 1;
                    Post.saveTitle(title, message.FromUserName, function(err, obj){
                        console.log(obj);
                        req.wxsession.postid = obj._id;
                    });
                    res.reply('标题为'+title+' 请上传图片banner');
                } else {
                    var postid = req.wxsession.postid;
                    if(req.wxsession.postbanner === 1 ) {
                        
                        if(message.Content === '完成') {
                            Post.done(postid, function(err, obj){console.log(obj)});
                            req.wxsession.postmode = 0;
                            req.wxsession.postbanner = 0;
                            req.wxsession.posttitle = 0;
                            res.reply('完成，url');
                        } else {
                            Post.saveContent(postid, message.Content, function(err, obj){console.log(obj)});
                            res.reply('继续输入，发送取消 或 完成 结束');
                            //处理文字
                        }
                    } else {
                        res.reply('发送图片或 取消 ');
                    } 
                }
                
            }
        }
        
        if(message.Content === '发布') {
            req.wxsession.postmode = 1;
            req.wxsession.postbanner = 0;
            req.wxsession.posttitle = 0;
            res.reply('进入发布模式，请输入标题');
        }

    }).voice(function (message, req, res, next) {
     
    }).image(function (message, req, res, next) {

        if(req.wxsession.postmode === 1) {
            if(req.wxsession.posttitle !== 1) {
                res.reply('请输入标题');
            } else {
              var Post = require('../model/post');
              var postid = req.wxsession.postid;
              if(req.wxsession.postbanner === 1 ) {
                  Post.saveImage(postid, 'Content', message.MediaId, function(err, result){console.log(result)});
                  res.reply('正文图片');
              } else {
                  req.wxsession.postbanner = 1;
                  Post.saveImage(postid, 'banner', message.MediaId, function(err, result){console.log(result)});
                  res.reply('请输入正文');
              }  
            }
           
         }
        
        //处理图片
        // var Message = require('../model/message');
        // Message.save(message, function(err, result){console.log(result)});
            
    }).location(function (message, req, res, next) {
      
    }).link(function (message, req, res, next) {
       
    }).event(function (message, req, res, next) {
        // var event = message.Event;
        // var openid = message.FromUserName;
        // var client = req.client;
        // var Reply = require('../model/reply');

        // if(event === 'subscribe') {
        //     redisClient.incr(req.client.client_id+':new.subscribe');
        //     var User = require('../model/user');
        //     var API = require('wechat').API;
        //     var api = new API(client.appid, client.appsecret);
        //     User.subscribe(openid, client.client_id, api, function(err, obj){
        //         if(err){
        //             console.log()
        //         } else {
        //             Reply.handle('subscribe', message, client, function(err, done){
        //                 if(err){
        //                     console.log(err);
        //                 } else {
        //                     if(done) {
        //                         //todo redis record
        //                     }
        //                 }
        //             });
        //         }
        //     });
        // }

        // if(event === 'unsubscribe') {
        //     redisClient.incr(req.client.client_id+':new.unsubscribe');
        //     var User = require('../model/user');
        //     User.unsubscribe(openid, function(err){
        //         if(err){
        //             console.log()
        //         }
        //     });
        // }

        // if(event === 'CLICK') {
        //    Reply.handle(message.EventKey, message, client, function(err, done){
        //         if(err){
        //             console.log(err);
        //         } else {
        //             if(done) {
        //                 //todo redis record
        //             }
        //         }
        //    });
        // }
        
        // res.writeHead(200);
        // res.end();

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

// router.get('/:wechat_token', function(req, res){

//     var message = {ToUserName: 'gh_44e8155eca9d',FromUserName: 'o094_t0a2KTqu2OKLHgYlgoi2j_0',CreateTime: '1359125035',MsgType: 'text',Content: 'test',MsgId: '5837397576500011341'};
//     // var message = {ToUserName: 'gh_44e8155eca9d',FromUserName: 'o094_t0a2KTqu2OKLHgYlgoi2j_0',CreateTime: '1359125035',MsgType: 'event',Event: 'unsubscribe'};
//     var wechatKeyword = message.Content;

//     var Keyword = require('../model/keyword');



//     // var event = message.Event;
//     var openid = message.FromUserName;
//     var client = req.client;

//     // if(event === 'subscribe') {
//     //     var User = require('../model/user');
//     //     var API = require('wechat').API;
//     //     var api = new API(client.appid, client.appsecret);
//     //     User.subscribe(openid, client.client_id, api, function(err, obj){
//     //         if(err){
//     //             console.log()
//     //         }
//     //     });
//     // }

//     // if(event === 'unsubscribe') {
//     //     var User = require('../model/user');
//     //     User.unsubscribe(openid, function(err){console.log(err)});
//     // } 

//     if(message.MsgType === 'text') {
//         Keyword.handle(message, client, function(err, done){
//             if(!done) {
//                 var Reply = require('../model/reply');
//                 Reply.handle('text', message, req.client, function(){});
//             }
//         });
//         // Keyword.handle(message, client, function(){});
//         res.writeHead(200);
//         res.end();
//         // Keyword.findByKeyword(wechatKeyword, client.client_id, function(err, keywords){
//         //     if (err) {
//         //         console.log(err);
//         //     } else {
//         //         var is_reply = 1;
//         //         if(keywords.length === 0){
//         //             is_reply = 0;
//         //             saveMessage(message, is_reply);
//         //         } else {
//         //            // var API = require('wechat').API;
//         //            // var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
//         //            // var api = new API(client.appid, client.appsecret);
//         //            var openid = message.FromUserName;
//         //            var media = new Array();
//         //            media.text = new Array();
//         //            for(var i = 0; i < keywords.length; i++){
//         //                //所有待回复文字合并为数组
//         //                media.text = media.text.concat(keywords[i].media.text);
//         //            }
//         //            replyMeida(client, openid, media); 
//         //         }

//         //         res.writeHead(200);
//         //         res.end();
//         //     }
//         // });
//     }

   
// });


// router.get('/', function(req, res) {
//     var redis = require("redis"),
//         client = redis.createClient(6379, '127.0.0.1', 0);
     

//     /*插入数据*/
//         if(client.exists('view')){
//             client.incrby('view', 1);
//             console.log(client.exists('view'));
//         } else {
//             console.log('set');
//             client.set('view', 1);
//         }

//         client.get('view', function(err, result){

//                 res.send(result);
//         });
//     // var API = require('wechat').API;
//     // var api = new API('wx380c0d5a96fccbf5', 'd12942b505f8fcc98e77918ddd0ab0f8');
//     // api.getUser('o094_t0a2KTqu2OKLHgYlgoi2j_0', function(err, result){
//     //     if(err)
//     //         console.log(err);
//     //     else 
//     //         res.send(result);
//     // });
//     // 
//     // api.sendText('o094_t0a2KTqu2OKLHgYlgoi2j_0', "hello", function(err, result){
//     //     if(err)
//     //         console.log(err);
//     //     else 
//     //         res.send(result);
//     // });
//     // api.list();
// });



// /**
//  * end loacl test
//  */







module.exports = router;
