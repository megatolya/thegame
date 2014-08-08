HTMLElement.prototype.offset = function() {
    var top=0, left=0;
    elem = this;
    while(elem) {
        top = top + parseFloat(elem.offsetTop);
        left = left + parseFloat(elem.offsetLeft);
        elem = elem.offsetParent;
    }

    return {top: Math.round(top), left: Math.round(left)}
};

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroReady2 = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

var heroImage2 = new Image();

heroImage2.onload = function() {
    heroReady2 = true;
};
heroImage2.src = "images/hero2.png";

// Monster image
var monsterReady = false;
var targetImg = new Image();
targetImg.onload = function () {
	monsterReady = true;
};
targetImg.src = "images/target.png";

// Game objects
var hero = {
	speed: 128 // movement in pixels per second
};
var monster = {};

// Handle keyboard controls
var keysDown = {};

var gameover = false;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);


addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var currentPointer = null;
canvas.addEventListener("click", function(e) {
    if (currentPointer) {
        clearTimeout(currentPointer.timerId);
        currentPointer = null;
    }

    currentPointer = {}
    currentPointer.x = e.pageX - canvas.offset().left;
    currentPointer.y = e.pageY - canvas.offset().top;
    currentPointer.timerId = setTimeout(function() {
        currentPointer = null;
    }, 1000);
});

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var heroStep = true;
var moving = false;
var timerId = null;

var nextStep = function() {
    heroStep = !heroStep;
    timerId = setTimeout(nextStep, 300);
    return timerId;
};

// Update game objects
var update = function (modifier) {
    moving = false;
        if (38 in keysDown) { //  up
            moving = true;
            hero.y -= hero.speed * modifier;
        }
        if (40 in keysDown) { // down
            moving = true;
            hero.y += hero.speed * modifier;
        }
        if (37 in keysDown) { // left
            moving = true;
            hero.x -= hero.speed * modifier;
        }
        if (39 in keysDown) { // right
            moving = true;
            hero.x += hero.speed * modifier;
        }

    if (currentPointer) {
        if (moving) {
            currentPointer = null;
        } else {
        }
        moving = true;
    }

    if (moving) {
        if (!timerId) {
            timerId = nextStep();
        }
    } else {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
    }

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
        gameover = true;
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("WINNER IS YOU", 32, 32);
        requestAnimationFrame(main);
	}
};


// Draw everything
var render = function () {
    if (gameover)
        return;

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady && heroReady2) {
		ctx.drawImage(heroStep ? heroImage : heroImage2, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(targetImg, monster.x, monster.y);
	}

    if (currentPointer) {
        // TODO зачем beginPath?
        ctx.beginPath();
        ctx.rect(currentPointer.x, currentPointer.y, 10, 10);
        ctx.stroke();
    }

};

// The main game loop
var main = function () {
    if (gameover)
        return;

	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
window.requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
