/// <reference path="../typings/server.d.ts" />

import socketio = require('socket.io');
var misc = require('../common/misc');
var assetsManager = require('./assets-manager');

var coords = misc.coords;

module.exports = server => {
    var io = socketio.listen(server);

    io
        .sockets.on('connection', socket => {
            socket.on('player:movement:start', coords => {
                console.log('emiting...');
                socket.emit('player:movement:start', coords);
            });
            socket.on('game.ready', () => {
                var realm = assetsManager.getRealm('testing-arena');

                socket.emit('game.realm.new', {
                    map: realm.map,
                    coords: coords(100, 100)
                });
            });
        });
};
