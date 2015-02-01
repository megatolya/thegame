/// <reference path="../typings/server.d.ts" />

import express = require('express');
import http = require('http');
import fs = require('fs');
import config = require('./config');
import path = require('path');
var assetsManager = require('./assets-manager');
var sessionstore = require('sessionstore');
var app = express();
var server =  http.createServer(app);
var cookieParser = require('cookie-parser')('secret');
var session = require('express-session');
var sessionStore = new session.MemoryStore();
var i = 0;

global.config = config;
app
    .set('views', __dirname + '/views')
    .set('view engine', 'jade')
    .use(function(req, res, next){
        console.log('%s %s', req.method, req.url);
        next();
    })
    .use(cookieParser)
    .use(session({
        resave: true,
        saveUninitialized: true,
        store: sessionStore,
        secret: 'secret'
    }))
    .use('/bower_components', express.static(path.resolve(path.join(__dirname, '../client/bower_components'))))
    .use('/components', express.static(path.resolve(path.join(__dirname, '../client/components'))))
    .use('/assets', express.static(path.resolve(path.join(__dirname, '../../assets'))))

    .get('/', (req, res) => res.sendFile(path.resolve(path.join(__dirname, '../client/index.html'))));

// This endpoint reveals it
app.get("/session", function(req:any, res){
    console.log('req.session', req.session);
  sessionStore.get(req.sessionID, function(err, data) {
    res.json({err: err, data:data, sessionID: req.sessionID});
  });
});

assetsManager.registerHandlers(app);



server.listen(config.port);
console.log('Server works at http://' + config.host + ':' + config.port);

module.exports = [server, sessionStore];
