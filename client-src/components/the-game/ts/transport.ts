/// <reference path="utils/channels.ts" />
/// <reference path="../../../../../d.ts/socket.io-client.d.ts" />

var socket = io();

var socketChannel = new utils.Channel('socket');
var domChannel = new utils.Channel('dom');

socket.on('game:realm:new', () => {
});

socket.on('player:movement:start', coords => {
    socketChannel.emit(coords);
});

domChannel.on('canvas:click', (coords) => {
    socketChannel.emit('player:movement:start', coords);
});

domChannel.on('canvas:ready', (coords) => {
    socket.emit('game.ready');
});
