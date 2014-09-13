/// <reference path="../utils/channels.ts" />
/// <reference path="camera.ts" />

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
        blocking: boolean;
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
        private camera: Game.Camera;
        private showGrid: boolean;

        constructor(tilesetPath: string, map: tiledJSON, camera) {
            this.image = new Image();
            this.camera = camera;
            this.map = map;
            this.image.src = tilesetPath;
            this.image.onload = () =>
                this.isReady = true;

            realms.push(this);

            var channel: utils.Channel = new utils.Channel('settings');
            // TODO вынести в класс tile
            this.showGrid = Game.Settings.get('grid');

            channel.on('grid', (newGrid: boolean) => {
                this.showGrid = newGrid;
            });
        }

        get allTiles(): any[][] {
            var maxX = this.width;
            var maxY = this.height;
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

                    map.layers.forEach(function(layer, index: number) {
                        sizes[index] = sizes[index] || [];
                        var tilesIds: number[] = layer.data;
                        var tileId: number = tilesIds[cellId] - 1;

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


            if (!this.showGrid)
                return;

            tilesToDraw[0].forEach((tileData: ITile) => {
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
        }

        get tileWidth(): number {
            return this.map.tilewidth;
        }

        get tileHeight(): number {
            return 64;
            return this.map.tileheight;
        }

        get width(): number {
            return this.map.width * this.map.tilewidth;
        }

        get height(): number {
            return this.map.height * this.map.tileheight;
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
