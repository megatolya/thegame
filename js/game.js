/// <reference path="defenitions/predefined.d.ts" />

var getOffset = function(elem) {
        var top=0, left=0;

    while(elem) {
        top = top + parseFloat(elem.offsetTop);
        left = left + parseFloat(elem.offsetLeft);
        elem = elem.offsetParent;
    }

    return {top: Math.round(top), left: Math.round(left)}
};

// Create the canvas
// TODO canvas dt
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


enum Direction {left, right, up, down, all};

class Picture {
    source;
    isReady: boolean = false;
    direction: Direction;
    constructor(src: string, direction: Direction = Direction.all) {
        var img = new Image();
        img.src = src;
        var self = this;
        img.onload = function() {
            self.isReady = true;
        };
        this.source = img;
        this.direction = direction;
    }
}

interface MapObjectParams {
    x: number;
    y: number;
    name: string;
    pictures: Array<Picture>;
}

var pointers: Array<MapPointer> = [];

class MapPointer {
    private visibilityTime: number = 1000;
    private timerId: number = 0;
    private _parent: MovingObject;

    x: number = 0;
    y: number = 0;

    heroX: number;
    heroY: number;

    visible: boolean = false;
    // TODO mv to hero
    active: boolean = false;

    constructor(_parent: MovingObject) {
        this._parent = _parent;
        pointers.push(this);
    }

    reset():void {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = 0;
            this.active = false;
            this.visible = false;
        }
    }

    set(x:number, y:number) {
        var self = this;

        this.visible = true;
        this.active = true;

        this.heroX = this._parent.x;
        this.heroY = this._parent.y;
        this.x = x;
        this.y = y;
        this.timerId = setTimeout(function() {
            self.visible = false;
        }, this.visibilityTime);
    }
}

class MapObject {
    x: number;
    y: number;
    name: string;
    pictures: Array<Picture>;
    pictureTimer: number = 0;
    pictureTime: number = 400;
    pictureCounter: number = 1;

    constructor(params: MapObjectParams) {
        this.x = params.x;
        this.y = params.y;
        this.name = params.name;
        this.pictures = params.pictures;
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get picture():Picture {
        return this.pictures[this.pictureCounter % this.pictures.length];
    }

    draw():void {
        if (this.picture.isReady)
            ctx.drawImage(this.picture.source, this.x, this.y);
    }
}

class MovingObject extends MapObject {
    speed: number = 128;
    pointer: MapPointer;

    constructor(params: MapObjectParams) {
        super(params);
        movingObjects.push(this);
        this.pointer = new MapPointer(this);
    }

    // TODO
    onTick(timeDelta: number):void {
        var self = this;
        var moving = false;

        if (38 in keysDown || 87 in keysDown) { //  up
            moving = true;
            this.y -= this.speed * timeDelta;
        }

        if (40 in keysDown || 83 in keysDown) { // down
            moving = true;
            this.y += this.speed * timeDelta;
        }

        if (37 in keysDown || 65 in keysDown) { // left
            moving = true;
            this.x -= this.speed * timeDelta;
        }

        if (39 in keysDown || 68 in keysDown) { // right
            moving = true;
            this.x += this.speed * timeDelta;
        }

        if (this.pointer.active) {
            // если уже двигаешь клавишами, то поинтер сбросить
            if (moving) {
                this.pointer.reset();
            } else if (Math.abs(this.pointer.x - this.x) < 1 && Math.abs(this.pointer.y - this.y) < 1) {
                this.pointer.reset();
            } else {
                var deltaX:number = this.pointer.x - this.pointer.heroX;
                var deltaY:number = this.pointer.y - this.pointer.heroY;
                var maxSpeed:number = this.speed * timeDelta;

                var deltaSum:number = Math.abs(deltaX) + Math.abs(deltaY);
                this.x += deltaX * this.speed * timeDelta / deltaSum;
                this.y += deltaY * this.speed * timeDelta / deltaSum;
            }

            moving = true;
        }

        var pictureTimerFn = function() {
            self.pictureCounter++;
            self.pictureTimer = setTimeout(pictureTimerFn, self.pictureTime);
        }

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
    }

    draw() {
        if (this.picture.isReady)
            ctx.drawImage(this.picture.source, this.x, this.y);

        if (this.pointer && this.pointer.visible) {
            ctx.beginPath();
            ctx.strokeStyle="blue";
            ctx.rect(this.pointer.x - 5, this.pointer.y - 5, 10, 10);
            ctx.stroke();
        }
    }
}

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

var movingObjects: Array<MovingObject> = [];

var hero = new MovingObject({
    x: 0,
    y: 0,
    name: 'hero',
    pictures: [new Picture('images/hero.png'), new Picture('images/hero2.png')]

});
console.log(123);

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

function reset():void {
    hero.set(canvas.width / 2, canvas.height / 2);
    target.set(32 + (Math.random() * (canvas.width - 64)),
        32 + (Math.random() * (canvas.height - 64)));
}

function update(timeDelta: number):void {
    movingObjects.forEach(function(obj: MovingObject) {
        obj.onTick(timeDelta);
    });

    if (
        hero.x <= (target.x + 32)
        && target.x <= (hero.x + 32)
        && hero.y <= (target.y + 32)
        && target.y <= (hero.y + 32)
    ) {
        gameover = true;
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("WINNER IS YOU", 32, 32);
        requestAnimationFrame(main);
    }
}

function render():void {
    if (gameover)
        return;

    background.draw();
    hero.draw();
    target.draw();
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

// Let's play this game!
var then:number = Date.now();

reset();

// FIXME
main();
