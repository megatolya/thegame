/// <reference path="express.d.ts" />
import express = require('express');
import http = require('http');
import fs = require('fs');
import config = require('./config');
import socketio = require('socket.io');
import path = require('path');

var app = express();
var server =  http.createServer(app);
var io = socketio.listen(server);

global.config = config;
app
    .set('views', __dirname + '/views')
    .set('view engine', 'jade')
    //.use(express.errorHandler({
        //dumpExceptions: true,
        //showStack: true
    //}))
    .use(function(req, res, next){
        console.log('%s %s', req.method, req.url);
        next();
    })
    //.use(express.cookieParser('121'))
    //.use(express.cookieSession('121'))
    //.use(express.bodyParser())
    .use('/bower_components', express.static(path.resolve(path.join(__dirname, '../client/bower_components'))))
    .use('/components', express.static(path.resolve(path.join(__dirname, '../client/components'))))
    .use('/images', express.static(path.resolve(path.join(__dirname, '../client/images'))))
    .use('/pages', express.static(path.resolve(path.join(__dirname, '../client/pages'))))

    .get('/', (req, res) => res.sendFile(path.resolve(path.join(__dirname, '../client/index.html'))));


io
    //.set('log level', 1)
    .sockets.on('connection', () => console.log('io connected'));

server.listen(config.port);
console.log('Server works at http://' + config.host + ':' + config.port);
