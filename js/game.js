/// <reference path="map.ts" />
/// <reference path="classes/picture.ts" />
/// <reference path="classes/player.ts" />
/// <reference path="classes/realm.ts" />
/// <reference path="classes/camera.ts" />
/// <reference path="ui.ts" />
/// <reference path="utils/misc.ts" />

(function() {
var getOffset = function(elem) {
        var top = 0,
            left = 0;

    while(elem) {
        top = top + parseFloat(elem.offsetTop);
        left = left + parseFloat(elem.offsetLeft);
        elem = elem.offsetParent;
    }

    return {
        top: Math.round(top),
        left: Math.round(left)
    };
};

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.game').appendChild(canvas);
});

var hero = new Game.Player({
    x: canvas.width / 2,
    y: canvas.height / 2,
    pictures: [new Game.Picture('images/hero.png'), new Game.Picture('images/hero2.png')],
    blocking: false
});

var camera = new Game.Camera({
    x: hero.x,
    y: hero.y,
    width: canvas.width,
    height: canvas.height
});

var world = new Game.Realm("images/tileset.png", map, camera);

var keysDown: Object = Object.create(null);

addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
}, false);

canvas.addEventListener('click', function(e) {
    hero.pointer.reset();
    hero.pointer.set(e.pageX - getOffset(canvas).left, e.pageY - getOffset(canvas).top);
});

var gameover: boolean = false;

var logChannel: Utils.Channel = new Utils.Channel('log');

var frames: number = 0;
var milisecSum: number = 0;

function update(timeDelta: number):void {
    milisecSum += timeDelta;
    frames++;

    if (milisecSum > 1) {
        logChannel.emit('table', {
            fps: frames
        });

        milisecSum = 0;
        frames = 0;
    }

    hero.onTick(timeDelta);
    camera.x = hero.x;
    camera.y = hero.y;
}

function render():void {
    if (gameover)
        return;

    world.draw(ctx);
    hero.draw(ctx);
}

function gameLoop():void {
    if (gameover)
        return;

    var now:number = Date.now();
    var delta:number = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    repaint();
}

var repaint = Utils.debounce(() => requestAnimationFrame(gameLoop), 0);

var then:number = Date.now();

gameLoop();
//requestAnimationFrame(gameLoop);
})();
