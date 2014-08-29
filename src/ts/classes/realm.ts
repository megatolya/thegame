/// <reference path="../utils/channels.ts" />

var channel: utils.Channel = new utils.Channel('settings');
var showGrid: boolean = false;

channel.on('grid', function(newGrid: boolean) {
    showGrid = newGrid;
});

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

        get rowsSizes(): number[] {
            var rowsCount = this.map.width;
            var rowsSizes:number[] = [];
            var startX = this.camera.startX;
            var startY = this.camera.startY;
            var endX = this.camera.endX;
            var endY = this.camera.endY;

            for (var i = 0; i < rowsCount; i++) {
                rowsSizes.push(i * this.tileWidth);
            }

            rowsSizes = rowsSizes.filter((size, i):any
                    => (startX < (rowsSizes[i + 1] || 0))
                    && (endX > (rowsSizes[i - 1] || 0)));

            return rowsSizes;
        }

        get colsSizes() {
            var colsCount: number = this.map.height;
            var colsSizes:number[] = [];
            var startX = this.camera.startX;
            var startY = this.camera.startY;
            var endX = this.camera.endX;
            var endY = this.camera.endY;

            for (var i: number = 0; i < colsCount; i++) {
                colsSizes.push(i * this.tileHeight);
            }

            colsSizes = colsSizes.filter((size, i):any
                    => (startY < (colsSizes[i + 1] || 0))
                    && (endY > (colsSizes[i - 1] || 0)));

            return colsSizes;
        }

        draw(ctx: CanvasRenderingContext2D):void {
            if (!this.isReady) {
                return;
            }

            var rowsCount = this.map.width;
            var colsCount = this.map.height;

            var tileSize: number = 16;

            var tilesPerRow = this.tilesPerRow;

            // TODO считать один раз
            var xyToId: Object = {};

            var i = 0;
            for (var row: number = 0; row < rowsCount; row++) {
                for (var col: number = 0; col < colsCount; col++) {
                    xyToId[row + ';' + col] = i;
                    i++;
                }
            }

            var rowsSizes = this.rowsSizes;
            var colsSizes = this.colsSizes;

            for (var layerId: number = 0; layerId < 2; layerId ++) {
                var tilesIds: number[] = this.map.layers[layerId].data;

                for (var row: number, absRow: number = 0; absRow < rowsSizes.length; absRow++) {
                    for (var col: number, absCol: number = 0; absCol < colsSizes.length; absCol++) {
                        // TODO полная каша с row/col + tileSize
                        row = colsSizes[absRow];
                        col = rowsSizes[absCol];

                        // row * 60 + col
                        var cellId = xyToId[row/tileSize + ';' + col/tileSize];
                        var tileId = tilesIds[cellId] - 1;
                        var tileRow = (tileId / tilesPerRow) | 0;
                        var tileCol = (tileId % tilesPerRow) | 0;

                        ctx.drawImage(this.image, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, (absCol * tileSize), (absRow * tileSize), tileSize, tileSize);
                    }
                }
            }

            if (!showGrid)
                return;

            for (var row: number = 0; row < rowsCount; row++) {
                for (var col: number = 0; col < colsCount; col++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'grey';
                    ctx.rect(col * tileSize, row * tileSize, col * tileSize + tileSize, row * tileSize + tileSize);
                    ctx.stroke();

                    //ctx.font="9px monospace";
                    //ctx.fillStyle = "black";
                    //ctx.fillText(i + '', col * tileSize, row * tileSize + tileSize - 3);
                    //i++;
                }
            }
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
    }
}
