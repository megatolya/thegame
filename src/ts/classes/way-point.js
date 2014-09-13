/// <reference path="../utils/channels.ts" />
/// <reference path="creatures/interface.ts" />
var Game;
(function (Game) {
    var WayPoint = (function () {
        function WayPoint(parent) {
            this.x = 0;
            this.y = 0;
            this.visible = false;
            this.active = false;
            this.visibilityTime = 0;
            this.timerId = 0;
            this.parent = parent;
        }
        WayPoint.prototype.reset = function () {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = 0;
                this.active = false;
                this.visible = false;
            }

            this.parent.prevDeltaX = 0;
            this.parent.prevDeltaY = 0;
        };

        Object.defineProperty(WayPoint.prototype, "deltaX", {
            get: function () {
                return this.x - this.fromX;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(WayPoint.prototype, "deltaY", {
            get: function () {
                return this.y - this.fromY;
            },
            enumerable: true,
            configurable: true
        });

        WayPoint.prototype.set = function (absX, absY) {
            var _this = this;
            var camera = Game.Camera.getCurrent();
            var newX = camera.startX + absX;
            var newY = camera.startY + absY;

            if (newX > Game.Realm.getCurrent().width || newY > Game.Realm.getCurrent().height) {
                return;
            }

            this.reset();
            this.fromX = this.parent.x;
            this.fromY = this.parent.y;

            this.x = newX;
            this.y = newY;

            this.visibilityTime && (this.timerId = setTimeout(function () {
                return _this.visible = false;
            }, this.visibilityTime));

            this.visible = true;
            this.active = true;
        };

        Object.defineProperty(WayPoint.prototype, "absX", {
            get: function () {
                return this.x - Game.Camera.getCurrent().startX;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(WayPoint.prototype, "absY", {
            get: function () {
                return this.y - Game.Camera.getCurrent().startY;
            },
            enumerable: true,
            configurable: true
        });

        WayPoint.prototype.draw = function (ctx) {
        };
        return WayPoint;
    })();
    Game.WayPoint = WayPoint;
})(Game || (Game = {}));
//# sourceMappingURL=way-point.js.map
