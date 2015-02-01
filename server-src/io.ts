/// <reference path="../typings/server.d.ts" />

import socketio = require('socket.io');
import express = require('express');
var connect = require('connect');
var cookie = require('cookie');

var misc = require('../common/misc');
var assetsManager = require('./assets-manager');

var coords = misc.coords;

module.exports = (server, sessionStore) => {
    var io = socketio.listen(server);
    io
        .use(function(socket, next) {
            socket.cookie = cookie.parse(socket.handshake.headers.cookie);
            socket.sessionID = socket.cookie['connect.sid']
                .replace(/^s:/, '')
                .replace(/\..+$/, '');

            console.log('sessionID', socket.sessionID);
            if (!socket.session) {
                sessionStore.get(socket.sessionID, function(err, session) {
                    console.log('err', err);
                    console.log('session', session);
                    socket.session = session;
                    next();
                });
                return;
            }

            next();
        })
        .on('connection', (socket, err) => {
            console.log('socket cookies is', socket.cookie);
            console.log('=========================================');
            console.log('socket session is', socket.session);
            console.log('=========================================');
            socket.on('player:movement:start', coords => {
                console.log('emiting...');
                socket.emit('player:movement:start', coords);
            });
            socket.on('game.ready', () => {
                console.log('GAME READY!');
                var realm = assetsManager.getRealm('testing-arena');

                socket.emit('game.realm.new', {
                    map: realm.map,
                    coords: coords(100, 100)
                });
            });
        });
};
