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

class ObjectPicture {
    source: Image;
    isReady: boolean = false;
    direction: Direction;
    constructor(src: string, direction: Direction = Direction.all) {
        var img:Image = new Image();
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
    pictures: Array<ObjectPicture>;
    pointer?: MapPointer;
}

var pointers: Array<MapPointer> = [];

class MapPointer {
    private visibilityTime: number = 1000;
    private timerId: number = 0;
    private parent: MovingObject;

    x: number;
    y: number;

    heroX: number;
    heroY: number;

    visible: boolean = false;
    // TODO mv to hero
    active: boolean = false;

    constructor(parent: MovingObject) {
        this.parent = parent;
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

    set(x, y) {
        var self = this;

        this.visible = true;
        this.active = true;

        this.heroX = this.parent.x;
        this.heroY = this.parent.y;
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
    pictures: Array<ObjectPicture>;
    pictureTimer: number = 0;
    pictureTime: number = 400;
    pictureCounter: number;

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

    // FIXME
    get picture():any {
        return this.pictures[0].source;
    }
}

class MovingObject extends MapObject {
    speed: number = 128;
    pointer: MapPointer;

    constructor(params: MapObjectParams) {
        super(params);
        movingObjects.push(this);
        this.pointer = params.pointer;
    }

    onTick(timeDelta: number):void {
        var self = this;
        var moving = false;

        if (38 in keysDown || 87 in keysDown) { //  up
            moving = true;
            hero.y -= hero.speed * timeDelta;
        }

        if (40 in keysDown || 83 in keysDown) { // down
            moving = true;
            hero.y += hero.speed * timeDelta;
        }

        if (37 in keysDown || 65 in keysDown) { // left
            moving = true;
            hero.x -= hero.speed * timeDelta;
        }

        if (39 in keysDown || 68 in keysDown) { // right
            moving = true;
            hero.x += hero.speed * timeDelta;
        }

        console.log(this);
        if (this.pointer.active) {
            // если уже двигаешь клавишами, то поинтер сбросить
            if (moving) {
                this.pointer.reset();
            } else if (Math.round(this.pointer.x) === Math.round(this.x)
                    && Math.round(this.pointer.y) === Math.round(this.y)) {
                this.pointer.reset();
            } else {
                var deltaX = this.pointer.x - this.pointer.heroX;
                var deltaY = this.pointer.y - this.pointer.heroY;
                console.log(this, this.pointer);
                console.log(deltaX, deltaY);
                this.x += deltaX / this.speed;
                this.y += deltaY / this.speed;
            }

            moving = true;
        }

        if (moving) {
            if (!this.pictureTimer) {
                this.pictureTimer = setTimeout(function() {
                    self.pictureCounter++;
                }, this.pictureTime);
            }
        } else {
            if (this.pictureTimer) {
                clearTimeout(this.pictureTimer);
                this.pictureTimer = 0;
            }
        }
    }
}

var target = new MapObject({
    x: 32 + (Math.random() * (canvas.width - 64)),
    y: 32 + (Math.random() * (canvas.height - 64)),
    name: 'target',
    pictures: [new ObjectPicture('images/target.png')]
});

var background = new MapObject({
    x: 0,
    y: 0,
    name: 'background',
    pictures: [new ObjectPicture('images/background.png')]
});

var movingObjects: Array<MovingObject> = [];

var hero = new MovingObject({
    x: 0,
    y: 0,
    name: 'hero',
    pictures: [new ObjectPicture('images/hero.png'), new ObjectPicture('images/hero2.png')],
    pointer: new MapPointer(this)

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

    ctx.drawImage(background.picture, background.x, background.y);
    ctx.drawImage(hero.picture, hero.x, hero.y);
    ctx.drawImage(target.picture, target.x, target.y);

    if (hero.pointer.visible) {
        ctx.beginPath();
        ctx.strokeStyle="blue";
        ctx.rect(hero.pointer.x - 5, hero.pointer.y - 5, 10, 10);
        ctx.stroke();
    }
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
setTimeout(function() {
    main();
}, 1000);
