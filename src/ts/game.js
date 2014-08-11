/// <reference path="defenitions/predefined.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var getOffset = function (elem) {
    var top = 0, left = 0;

    while (elem) {
        top = top + parseFloat(elem.offsetTop);
        left = left + parseFloat(elem.offsetLeft);
        elem = elem.offsetParent;
    }

    return { top: Math.round(top), left: Math.round(left) };
};

// Create the canvas
// TODO canvas dt
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

var Direction;
(function (Direction) {
    Direction[Direction["left"] = 0] = "left";
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["up"] = 2] = "up";
    Direction[Direction["down"] = 3] = "down";
    Direction[Direction["all"] = 4] = "all";
})(Direction || (Direction = {}));
;

var Picture = (function () {
    function Picture(src, direction) {
        if (typeof direction === "undefined") { direction = 4 /* all */; }
        this.isReady = false;
        var img = new Image();
        img.src = src;
        var self = this;
        img.onload = function () {
            self.isReady = true;
        };
        this.source = img;
        this.direction = direction;
    }
    return Picture;
})();

var pointers = [];

var MapPointer = (function () {
    function MapPointer(_parent) {
        this.visibilityTime = 1000;
        this.timerId = 0;
        this.visible = false;
        // TODO mv to hero
        this.active = false;
        this._parent = _parent;
        pointers.push(this);
    }
    MapPointer.prototype.reset = function () {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = 0;
            this.active = false;
            this.visible = false;
        }
    };

    MapPointer.prototype.set = function (x, y) {
        var self = this;

        this.visible = true;
        this.active = true;

        this.heroX = this._parent.x;
        this.heroY = this._parent.y;
        this.x = x;
        this.y = y;
        this.timerId = setTimeout(function () {
            self.visible = false;
        }, this.visibilityTime);
    };
    return MapPointer;
})();

var MapObject = (function () {
    function MapObject(params) {
        this.pictureTimer = 0;
        this.pictureTime = 400;
        this.pictureCounter = 1;
        this.x = params.x;
        this.y = params.y;
        this.name = params.name;
        this.pictures = params.pictures;
    }
    MapObject.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
    };

    Object.defineProperty(MapObject.prototype, "picture", {
        get: function () {
            return this.pictures[this.pictureCounter % this.pictures.length];
        },
        enumerable: true,
        configurable: true
    });

    MapObject.prototype.draw = function () {
        if (this.picture.isReady)
            ctx.drawImage(this.picture.source, this.x, this.y);
    };
    return MapObject;
})();

var MovingObject = (function (_super) {
    __extends(MovingObject, _super);
    function MovingObject(params) {
        _super.call(this, params);
        this.speed = 128;
        movingObjects.push(this);
        this.pointer = new MapPointer(this);
    }
    // TODO
    MovingObject.prototype.onTick = function (timeDelta) {
        var self = this;
        var moving = false;

        if (38 in keysDown || 87 in keysDown) {
            moving = true;
            this.y -= this.speed * timeDelta;
        }

        if (40 in keysDown || 83 in keysDown) {
            moving = true;
            this.y += this.speed * timeDelta;
        }

        if (37 in keysDown || 65 in keysDown) {
            moving = true;
            this.x -= this.speed * timeDelta;
        }

        if (39 in keysDown || 68 in keysDown) {
            moving = true;
            this.x += this.speed * timeDelta;
        }

        console.log(this.pointer.x, this.x);
        console.log(this.pointer.y, this.y);
        if (this.pointer.active) {
            // если уже двигаешь клавишами, то поинтер сбросить
            if (moving) {
                this.pointer.reset();
            } else if (Math.round(this.pointer.x) === Math.round(this.x) && Math.round(this.pointer.y) === Math.round(this.y)) {
                this.pointer.reset();
            } else {
                var deltaX = this.pointer.x - this.pointer.heroX;
                var deltaY = this.pointer.y - this.pointer.heroY;
                var maxSpeed = this.speed * timeDelta;

                var deltaSum = Math.abs(deltaX) + Math.abs(deltaY);
                this.x += deltaX * this.speed * timeDelta / deltaSum;
                this.y += deltaY * this.speed * timeDelta / deltaSum;
            }

            moving = true;
        }

        var pictureTimerFn = function () {
            self.pictureCounter++;
            self.pictureTimer = setTimeout(pictureTimerFn, self.pictureTime);
        };

        if (moving) {
            if (!this.pictureTimer) {
                this.pictureTimer = setTimeout(pictureTimerFn, this.pictureTime);
            }
        } else {
            if (this.pictureTimer) {
                clearTimeout(this.pictureTimer);
                this.pictureTimer = 0;
            }
        }
    };

    MovingObject.prototype.draw = function () {
        if (this.picture.isReady)
            ctx.drawImage(this.picture.source, this.x, this.y);

        if (this.pointer && this.pointer.visible) {
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.rect(this.pointer.x - 5, this.pointer.y - 5, 10, 10);
            ctx.stroke();
        }
    };
    return MovingObject;
})(MapObject);

var target = new MapObject({
    x: 32 + (Math.random() * (canvas.width - 64)),
    y: 32 + (Math.random() * (canvas.height - 64)),
    name: 'target',
    pictures: [new Picture('images/target.png')]
});

var background = new MapObject({
    x: 0,
    y: 0,
    name: 'background',
    pictures: [new Picture('images/background.png')]
});

var movingObjects = [];

var hero = new MovingObject({
    x: 0,
    y: 0,
    name: 'hero',
    pictures: [new Picture('images/hero.png'), new Picture('images/hero2.png')]
});
console.log(123);

var keysDown = Object.create(null);
addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
}, false);

canvas.addEventListener('click', function (e) {
    hero.pointer.reset();
    hero.pointer.set(e.pageX - getOffset(canvas).left, e.pageY - getOffset(canvas).top);
});

var gameover = false;

function reset() {
    hero.set(canvas.width / 2, canvas.height / 2);
    target.set(32 + (Math.random() * (canvas.width - 64)), 32 + (Math.random() * (canvas.height - 64)));
}

function update(timeDelta) {
    movingObjects.forEach(function (obj) {
        obj.onTick(timeDelta);
    });

    if (hero.x <= (target.x + 32) && target.x <= (hero.x + 32) && hero.y <= (target.y + 32) && target.y <= (hero.y + 32)) {
        gameover = true;
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("WINNER IS YOU", 32, 32);
        requestAnimationFrame(main);
    }
}

function render() {
    if (gameover)
        return;

    background.draw();
    hero.draw();
    target.draw();
}

function main() {
    if (gameover)
        return;

    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
}

// Let's play this game!
var then = Date.now();

reset();

// FIXME
main();
