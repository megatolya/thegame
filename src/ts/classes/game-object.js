/// <reference path="picture.ts" />
/// <reference path="way-point.ts" />
/// <reference path="creatures/interface.ts" />
/// <reference path="settings.ts" />
/// <reference path="../utils/channels.ts" />
var Game;
(function (Game) {
    var GameObject = (function () {
        function GameObject(params) {
            var _this = this;
            this.speed = 80;
            // TODO make it private
            this.prevDeltaX = 0;
            this.prevDeltaY = 0;
            this.pictureTimer = 0;
            this.picturesTimeout = 400;
            this.pictureCounter = 1;
            this.deltaSum = 0;
            this.x = params.x;
            this.y = params.y;
            this.pictures = [];
            this.pointer = new Game.WayPoint(this);

            GameObject.players.push(this);

            this.showGrid = Game.Settings.get('grid');

            new utils.Channel('settings').on('grid', function (newVal) {
                _this.showGrid = newVal;
            });
        }
        Object.defineProperty(GameObject.prototype, "picture", {
            get: function () {
                return this.pictures[this.pictureCounter % this.pictures.length];
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(GameObject.prototype, "absX", {
            get: function () {
                return this.x - Game.Camera.getCurrent().startX;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(GameObject.prototype, "absY", {
            get: function () {
                return this.y - Game.Camera.getCurrent().startY;
            },
            enumerable: true,
            configurable: true
        });

        GameObject.prototype.draw = function (ctx) {
            this.pointer.draw(ctx);

            // TODO tile class?
            var tileWidth = Game.Realm.getCurrent().tileWidth;
            var tileHeight = Game.Realm.getCurrent().tileHeight;

            if (this.showGrid) {
                //this.hoveredTiles.forEach((tile: Game.ITile) => {
                //tile.absX = tile.x - Game.Camera.getCurrent().startX;
                //tile.absY = tile.y - Game.Camera.getCurrent().startY;
                //ctx.beginPath();
                //ctx.lineWidth = 1;
                //ctx.strokeStyle = 'orange';
                //ctx.rect(tile.absX, tile.absY, tileWidth, tileHeight);
                //ctx.stroke();
                //});
            }

            if (this.picture.isReady) {
                ctx.drawImage(this.picture.source, this.absX - this.width / 2, this.absY - this.height / 2);
            }
        };

        GameObject.prototype.onTick = function (timeDelta) {
            this.deltaSum += timeDelta;

            if (this.pointer.active) {
                if (this.deltaSum > this.picturesTimeout / 1000) {
                    this.deltaSum = 0;
                    this.pictureCounter++;
                }

                if (Math.abs(this.pointer.x - this.x) < 2 && Math.abs(this.pointer.y - this.y) < 2) {
                    this.pointer.reset();
                    this.deltaSum = 0;
                    return;
                } else {
                    var deltaX = this.pointer.deltaX;
                    var deltaY = this.pointer.deltaY;

                    var deltaSum = Math.abs(deltaX) + Math.abs(deltaY);
                    var prevX = this.x;
                    var prevY = this.y;

                    this.x += deltaX * this.speed * timeDelta / deltaSum;

                    if (this.hoveredTiles.some(function (tile) {
                        return tile.blocking;
                    })) {
                        this.x = prevX;
                    }

                    this.y += deltaY * this.speed * timeDelta / deltaSum;

                    if (this.hoveredTiles.some(function (tile) {
                        return tile.blocking;
                    })) {
                        this.y = prevY;
                    }

                    this.pointer.fromY = prevY;
                    this.pointer.fromX = prevX;
                }

                this.checkFailWay();
            } else {
                if (this.pictureTimer) {
                    clearTimeout(this.pictureTimer);
                    this.pictureTimer = 0;
                }
            }
        };

        // ушел дальше, чем указывает WayPoint
        GameObject.prototype.checkFailWay = function () {
            var deltaX = Math.abs(this.x - this.pointer.x);
            var deltaY = Math.abs(this.y - this.pointer.y);

            if ((this.prevDeltaX && this.prevDeltaX < deltaX) || (this.prevDeltaY && this.prevDeltaY < deltaY)) {
                this.x = this.pointer.x;
                this.y = this.pointer.y;
                this.pointer.reset();
                return;
            }

            this.prevDeltaX = deltaX;
            this.prevDeltaY = deltaY;
        };

        Object.defineProperty(GameObject.prototype, "width", {
            get: function () {
                return this.picture.source.width;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(GameObject.prototype, "height", {
            get: function () {
                return this.picture.source.height;
            },
            enumerable: true,
            configurable: true
        });

        GameObject.getCurrent = function () {
            return this.players[0];
        };

        Object.defineProperty(GameObject.prototype, "hoveredTiles", {
            get: function () {
                var _this = this;
                var tiles = Game.Realm.getCurrent().allTiles[1];

                // TODO Нормальные условия
                tiles = tiles.filter(function (tileData) {
                    return tileData.x > _this.x - _this.width && tileData.x < _this.x + _this.width && tileData.y < _this.y + Game.Realm.getCurrent().tileHeight && tileData.y > _this.y;
                }, this);
                tiles.pop();

                return tiles;
            },
            enumerable: true,
            configurable: true
        });
        GameObject.players = [];
        return GameObject;
    })();
    Game.GameObject = GameObject;
})(Game || (Game = {}));
//# sourceMappingURL=game-object.js.map
