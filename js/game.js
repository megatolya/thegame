/// <reference path="map.ts" />
/// <reference path="classes/picture.ts" />
/// <reference path="classes/player.ts" />
/// <reference path="classes/realm.ts" />

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

canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

var world = new Game.Realm("images/tileset.jpg", map, ctx);


var hero = new Game.Player({
    x: canvas.width - 50,
    y: canvas.height - 50,
    pictures: [new Game.Picture('images/hero.png'), new Game.Picture('images/hero2.png')],
    blocking: false
});

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

var gameover:boolean = false;

function update(timeDelta: number):void {
    hero.onTick(timeDelta);

    /*
    if (
        hero.x <= (target.x + 32)
        && target.x <= (hero.x + 32)
        && hero.y <= (target.y + 32)
        && target.y <= (hero.y + 32)
    ) {
        gameover = true;
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("WINNER IS YOU", 32, 32);
        requestAnimationFrame(main);
    }
    */
}

function render():void {
    if (gameover)
        return;

    world.draw();
    hero.draw();
    //background.draw();
    //wall.draw();
    //target.draw();
}

function main():void {
    if (gameover)
        return;

    var now:number = Date.now();
    var delta:number = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
}

var then:number = Date.now();

main();
