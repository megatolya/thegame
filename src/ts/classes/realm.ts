/// <reference path="../utils/channels.ts" />

var channel: utils.Channel = new utils.Channel('settings');
// TODO вынести в класс tile
var showGrid: boolean = false;

channel.on('grid', function(newGrid: boolean) {
    showGrid = newGrid;
});

interface Object {
    __defineGetter__: any;
}

interface Window {
    ololo: any;
}

var realms = [];

module Game {
    export interface xy {
        x: number;
        y: number;
        absX?: number;
        absY?: number;
    }

    export interface ITile extends xy {
        absX: number;
        absY: number;
        cellId: number;
        tileId: number;
        tileRow: number;
        tileCol: number;
    }

    export interface tiledJSON {
        width: number;
        height: number;

        tilewidth: number;
        tileheight: number;

        version: number;

        layers: Object;
        orientation: string;
        tilesets: Array<any>;
    }

    export class Realm {
        private map: tiledJSON;
        private image: HTMLImageElement;
        private isReady: boolean = false;
        private camera: Camera;

        constructor(tilesetPath: string, map: tiledJSON, camera) {
            this.image = new Image();
            this.camera = camera;
            this.map = map;
            this.image.src = tilesetPath;
            this.image.onload = () =>
                this.isReady = true;

            realms.push(this);
        }

        get allTiles(): any[][] {
            var maxX = this.map.width * this.tileWidth;
            var maxY = this.map.height * this.tileHeight;
            var emptyXY = {x: 0, y: 0};
            var sizesX: number[] = [];

            var i = 0;
            var x = 0;

            while (x - this.tileWidth < maxX) {
                sizesX.push(x);
                i++;
                x = i * this.tileWidth;
            }

            var y = 0;
            var sizes: xy[][] = [];
            var tilesPerRow: number = this.tilesPerRow;

            var xyToId: Object = {};

            i = 0;
            for (var row: number = 0; row < this.map.width; row++) {
                for (var col: number = 0; col < this.map.height; col++) {
                    xyToId[col + ';' + row] = i;
                    i++;
                }
            }

            i = 0;
            while (y - this.tileHeight < maxY) {
                sizesX.forEach((x) => {
                    var cellId: number = xyToId[x / this.tileWidth + ';' + y / this.tileHeight];

                    map.layers.forEach(function(layer, index) {
                        sizes[index] = sizes[index] || [];
                        var tilesIds: number[] = layer.data;
                        var tileId: number = tilesIds[cellId] - 1;

                        if (!tileId || !cellId)
                            return;

                        sizes[index].push({
                            x: x,
                            y: y,
                            cellId: cellId,
                            tileId: tileId,
                            tileCol: (tileId / tilesPerRow) | 0,
                            tileRow: (tileId % tilesPerRow) | 0
                        });
                    });
                    cellId++;
                });
                i++;
                y = i * this.tileHeight;
            }

            delete this.allTiles;

            this.__defineGetter__('allTiles', () => sizes);

             //TODO define getter

            return sizes;
        }

        get tilesToDraw(): ITile[][] {
            var sizes: ITile[][] = this.allTiles;
            var startX = this.camera.startX;
            var startY = this.camera.startY;
            var endX = this.camera.endX;
            var endY = this.camera.endY;
            var tileWidth = this.tileWidth;
            var tileHeight = this.tileHeight;

            sizes = sizes.map((layer: ITile[], i: number): ITile[] => {
                var layerToDraw: ITile[] = layer.filter((size: ITile) => {
                    return startX <= size.x + tileWidth
                        && endX >= size.x - tileWidth
                        && startY <= size.y + tileHeight
                        && endY >= size.y - tileHeight;
                });

                layerToDraw.forEach((size: ITile) => {
                    size.absX = size.x - startX;
                    size.absY = size.y - startY;
                });

                return layerToDraw;
            });

            return sizes;
        }

        draw(ctx: CanvasRenderingContext2D):void {
            if (!this.isReady) {
                return;
            }

            var tileWidth: number = this.tileWidth;
            var tileHeight: number = this.tileHeight;

            var tilesToDraw: xy[][] = this.tilesToDraw;

            tilesToDraw.forEach((layer: ITile[]) => {
                layer.forEach((tileData: ITile) => {
                    ctx.drawImage(
                        this.image,
                        tileData.tileRow * tileHeight,
                        tileData.tileCol * tileWidth,
                        tileWidth,
                        tileHeight,
                        tileData.absX,
                        tileData.absY,
                        tileWidth,
                        tileHeight
                    );
                });
            });


            if (!showGrid)
                return;

            tilesToDraw[0].forEach((tileData: ITile) => {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'grey';
                ctx.rect(tileData.absX, tileData.absY, tileWidth, tileHeight);
                ctx.stroke();
            });
        }

        get tileWidth(): number {
            return this.map.tilewidth;
        }

        get tileHeight(): number {
            return this.map.tileheight;
        }

        private get tilesPerRow(): number {
            return map.tilesets[0].imagewidth / map.tilewidth;
        }

        private __defineGetter__(str: string, fn: any) {
            return Object.__defineGetter__.bind(this);
        }

        static getCurrent(): Realm {
            return realms[0];
        }
    }
}
