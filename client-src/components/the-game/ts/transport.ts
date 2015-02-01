/// <reference path="utils/channels.ts" />
/// <reference path="../../../../../typings/client.d.ts" />

var socket = io();

var socketChannel = new utils.Channel('socket');
var domChannel = new utils.Channel('dom');

socket.on('game:realm:new', () => {
    console.log(arguments);
});

socket.on('player:movement:start', coords => {
    socketChannel.emit('player:movement:start', coords);
});

domChannel.on('canvas:click', (coords) => {
    socketChannel.emit('player:movement:start', coords);
});

domChannel.on('canvas:ready', (coords) => {
    socket.emit('game.ready');
});
