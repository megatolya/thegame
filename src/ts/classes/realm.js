/// <reference path="../utils/channels.ts" />
/// <reference path="camera.ts" />

var realms = [];

var Game;
(function (Game) {
    var Realm = (function () {
        function Realm(tilesetPath, map, camera) {
            var _this = this;
            this.isReady = false;
            this.image = new Image();
            this.camera = camera;
            this.map = map;
            this.image.src = tilesetPath;
            this.image.onload = function () {
                return _this.isReady = true;
            };

            realms.push(this);

            var channel = new utils.Channel('settings');

            // TODO вынести в класс tile
            this.showGrid = Game.Settings.get('grid');

            channel.on('grid', function (newGrid) {
                _this.showGrid = newGrid;
            });
        }
        Object.defineProperty(Realm.prototype, "allTiles", {
            get: function () {
                var _this = this;
                var maxX = this.width;
                var maxY = this.height;
                var emptyXY = { x: 0, y: 0 };
                var sizesX = [];

                var i = 0;
                var x = 0;

                while (x - this.tileWidth < maxX) {
                    sizesX.push(x);
                    i++;
                    x = i * this.tileWidth;
                }

                var y = 0;
                var sizes = [];
                var tilesPerRow = this.tilesPerRow;

                var xyToId = {};

                i = 0;
                for (var row = 0; row < this.map.width; row++) {
                    for (var col = 0; col < this.map.height; col++) {
                        xyToId[col + ';' + row] = i;
                        i++;
                    }
                }

                i = 0;
                while (y - this.tileHeight < maxY) {
                    sizesX.forEach(function (x) {
                        var cellId = xyToId[x / _this.tileWidth + ';' + y / _this.tileHeight];

                        map.layers.forEach(function (layer, index) {
                            sizes[index] = sizes[index] || [];
                            var tilesIds = layer.data;
                            var tileId = tilesIds[cellId] - 1;

                            if (!tileId || !cellId) {
                                return;
                            }

                            sizes[index].push({
                                x: x,
                                y: y,
                                cellId: cellId,
                                tileId: tileId,
                                tileCol: (tileId / tilesPerRow) | 0,
                                blocking: tileId !== -1 && index === 1,
                                tileRow: (tileId % tilesPerRow) | 0
                            });
                        });
                        cellId++;
                    });
                    i++;
                    y = i * this.tileHeight;
                }

                delete this.allTiles;

                this.__defineGetter__('allTiles', function () {
                    return sizes;
                });

                //TODO define getter
                return sizes;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Realm.prototype, "tilesToDraw", {
            get: function () {
                var sizes = this.allTiles;
                var startX = this.camera.startX;
                var startY = this.camera.startY;
                var endX = this.camera.endX;
                var endY = this.camera.endY;
                var tileWidth = this.tileWidth;
                var tileHeight = this.tileHeight;

                sizes = sizes.map(function (layer, i) {
                    var layerToDraw = layer.filter(function (size) {
                        return startX <= size.x + tileWidth && endX >= size.x - tileWidth && startY <= size.y + tileHeight && endY >= size.y - tileHeight;
                    });

                    layerToDraw.forEach(function (size) {
                        size.absX = size.x - startX;
                        size.absY = size.y - startY;
                    });

                    return layerToDraw;
                });

                return sizes;
            },
            enumerable: true,
            configurable: true
        });

        Realm.prototype.draw = function (ctx) {
            var _this = this;
            if (!this.isReady) {
                return;
            }

            var tileWidth = this.tileWidth;
            var tileHeight = this.tileHeight;

            var tilesToDraw = this.tilesToDraw;

            tilesToDraw.forEach(function (layer) {
                layer.forEach(function (tileData) {
                    ctx.drawImage(_this.image, tileData.tileRow * tileHeight, tileData.tileCol * tileWidth, tileWidth, tileHeight, tileData.absX, tileData.absY, tileWidth, tileHeight);
                });
            });

            if (!this.showGrid)
                return;

            tilesToDraw[0].forEach(function (tileData) {
                if (tileData.blocking)
                    return;
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'green';
                ctx.rect(tileData.absX, tileData.absY, tileWidth, tileHeight);
                ctx.stroke();
            });
            //tilesToDraw[1].forEach((tileData: ITile) => {
            //if (!tileData.blocking)
            //return;
            //ctx.beginPath();
            //ctx.lineWidth = 1;
            //ctx.strokeStyle = 'red';
            //ctx.rect(tileData.absX, tileData.absY, tileWidth, tileHeight);
            //ctx.stroke();
            //});
        };

        Object.defineProperty(Realm.prototype, "tileWidth", {
            get: function () {
                return this.map.tilewidth;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Realm.prototype, "tileHeight", {
            get: function () {
                return 64;
                return this.map.tileheight;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Realm.prototype, "width", {
            get: function () {
                return this.map.width * this.map.tilewidth;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Realm.prototype, "height", {
            get: function () {
                return this.map.height * this.map.tileheight;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Realm.prototype, "tilesPerRow", {
            get: function () {
                return map.tilesets[0].imagewidth / map.tilewidth;
            },
            enumerable: true,
            configurable: true
        });

        Realm.prototype.__defineGetter__ = function (str, fn) {
            return Object.__defineGetter__.bind(this);
        };

        Realm.getCurrent = function () {
            return realms[0];
        };
        return Realm;
    })();
    Game.Realm = Realm;
})(Game || (Game = {}));
//# sourceMappingURL=realm.js.map
