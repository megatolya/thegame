/// <reference path="game-object.ts" />
/// <reference path="../map.ts" />
var cameras = [];

var Game;
(function (Game) {
    var Camera = (function () {
        function Camera(params) {
            var _this = this;
            this._x = 0;
            this._y = 0;
            this.canvas = params.canvas;
            this.x = params.x;
            this.y = params.y;

            if (this.x <= 0) {
                // TODO use x
                this._x = this.width / 2;
            }

            if (this.y <= 0) {
                this._y = this.height / 2;
            }

            cameras.push(this);

            var resize = function () {
                _this.x = Game.GameObject.getCurrent().x - _this.width / 2;
                _this.y = Game.GameObject.getCurrent().y - _this.height / 2;
            };

            window.addEventListener('resize', resize);
            new utils.Channel('settings').on('fullsize', resize);
        }

        Object.defineProperty(Camera.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (newX) {
                if (newX < this.width / 2) {
                    return;
                }

                if (newX + this.width / 2 > map.width * map.tilewidth) {
                    return;
                }

                this._x = newX;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Camera.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (newY) {
                if (newY < this.width / 2)
                    return;

                if (newY + this.height / 2 > map.height * map.tileheight)
                    return;

                this._y = newY;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "startX", {
            get: function () {
                return Math.round(this.x - this.width / 2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "startY", {
            get: function () {
                return Math.round(this.y - this.height / 2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "endX", {
            get: function () {
                return Math.round(this.x + this.width / 2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "endY", {
            get: function () {
                return Math.round(this.y + this.height / 2);
            },
            enumerable: true,
            configurable: true
        });

        Camera.getCurrent = function () {
            return cameras[0];
        };

        Object.defineProperty(Camera.prototype, "width", {
            get: function () {
                return this.canvas.width;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "height", {
            get: function () {
                return this.canvas.height;
            },
            enumerable: true,
            configurable: true
        });
        return Camera;
    })();
    Game.Camera = Camera;
})(Game || (Game = {}));
//# sourceMappingURL=camera.js.map
