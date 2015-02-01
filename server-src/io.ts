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

            if (!socket.session) {
                sessionStore.get(socket.sessionID, function(err, session) {
                    socket.session = session;
                    session
                    next();
                });
                return;
            }

            next();
        })
        .on('connection', (socket, err) => {
            socket.on('player:movement:start', coords => {
                socket.emit('player:movement:start', coords);
            });
            socket.on('game.ready', () => {
                var realm = assetsManager.getRealm('testing-arena');

                console.log('emiting!');
                socket.emit('game.realm.new', {
                    map: realm.map,
                    tileset: realm.url,
                    coords: coords(100, 100)
                });
            });
        });
};
