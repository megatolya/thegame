/// <reference path="../utils/channels.ts" />

var channel: utils.Channel = new utils.Channel('settings');
var showGrid: boolean = false;

channel.on('grid', function(newGrid: boolean) {
    showGrid = newGrid;
});

interface xy {
    x: number;
    y: number;
    absX?: number;
    absY?: number;
}

interface ITile extends xy {
    absX: number;
    absY: number;
    cellId: number;
    tileId: number;
    tileRow: number;
    tileCol: number;
}

interface Object {
    __defineGetter__: any;
}

interface Window {
    ololo: any;
}

module Game {
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
        }

        get allTiles(): xy[] {
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
            var sizes: xy[] = [];
            var tilesPerRow: number = this.tilesPerRow;

            var xyToId: Object = {};

            i = 0;
            for (var row: number = 0; row < this.map.width; row++) {
                for (var col: number = 0; col < this.map.height; col++) {
                    xyToId[row + ';' + col] = i;
                    i++;
                }
            }

            i = 0;
            while (y - this.tileHeight < maxY) {
                sizesX.forEach((x) => {
                    var cellId: number = xyToId[x / this.tileWidth + ';' + y / this.tileHeight];
                    var tilesIds: number[] = this.map.layers[0].data;
                    var tileId: number = tilesIds[cellId] - 1;

                    sizes.push({
                        x: x,
                        y: y,
                        cellId: cellId,
                        tileId: tileId,
                        tileCol: (tileId / tilesPerRow) | 0,
                        tileRow: (tileId % tilesPerRow) | 0
                    });
                    cellId++;
                });
                i++;
                y = i * this.tileHeight;
            }

            //delete this.allTiles;

            //this.__defineGetter__('allTiles', () => sizes);

            // TODO define getter

            return sizes;
        }

        get tilesToDraw() {
            var sizes: xy[] = this.allTiles;
            var startX = this.camera.startX;
            var startY = this.camera.startY;
            var endX = this.camera.endX;
            var endY = this.camera.endY;

            // выше можно выделить в геттер
            sizes = sizes.filter((size: xy, i: number):any
                    => startX <= size.x
                    && endX >= size.x
                    && startY <= size.y
                    && endY >= size.y);

            sizes = sizes.map((size: xy):any
                    => (size.absX = size.x - startX, size.absY = size.y - startY, size));

            //document.body.innerHTML = JSON.stringify(sizes);
            return sizes;
        }

        draw(ctx: CanvasRenderingContext2D):void {
            if (!this.isReady) {
                return;
            }

            var tileWidth: number = this.tileWidth;
            var tileHeight: number = this.tileHeight;

            this.tilesToDraw.forEach((tileInfo: ITile) => {
                ctx.drawImage(
                    this.image,
                    tileInfo.tileRow * tileHeight,
                    tileInfo.tileCol * tileWidth,
                    tileWidth,
                    tileHeight,
                    tileInfo.absX,
                    tileInfo.absY,
                    tileWidth,
                    tileHeight
                );

                ctx.font="9px monospace";
                ctx.fillStyle = "black";
                ctx.fillText(tileInfo.tileId + '', tileInfo.absX, tileInfo.absY);
            });

            if (!showGrid)
                return;

            // setka
        }

        private get tileWidth(): number {
            return this.map.tilewidth;
        }

        private get tileHeight(): number {
            return this.map.tileheight;
        }

        private get tilesPerRow(): number {
            return map.tilesets[0].imagewidth / map.tilewidth;
        }

        private __defineGetter__(str: string, fn: any) {
            return Object.__defineGetter__.bind(this);
        }
    }
}
