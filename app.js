
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

// 设置日志级别
io.set('log level', 2);

// socket
io.sockets.on('connection', function(socket){
    console.log('opened...')
    socket.emit('open');

    // 客户端对象
    var client = {
        userName: null
    };

    socket.on('message', function(msg){
        var info = {
            text: msg,
            author: client.userName,
            type: 'message',
            time: new Date()
        };

        if(client.userName){
            socket.emit('message', info);
            socket.broadcast.emit('message', info);
        }
        // 首次输入即用户名
        else{
            info.author = 'system';
            info.type = 'welcome';

            socket.emit('system', info);
            socket.broadcast.emit('system', info);

            client.userName = msg;
        }

    });

    // 断开链接
    socket.on('disconnect', function(){
        if(client.userName){
            socket.broadcast.emit('system', {
                text: client.userName,
                author: 'system',
                type: 'disconnect',
                time: new Date()
            })
        }
    });
});

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
