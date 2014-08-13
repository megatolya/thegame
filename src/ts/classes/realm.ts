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
        private ctx: CanvasRenderingContext2D;
        private map: tiledJSON;
        private image: HTMLImageElement;
        private isReady: boolean = false;

        constructor(tileSetPath: string, map: tiledJSON, ctx: CanvasRenderingContext2D ) {
            this.ctx = ctx;
            this.image = new Image();
            this.map = map;
            this.image.src = tileSetPath;
            this.image.onload = () =>
                this.isReady = true;
        }

        draw():void {
            if (!this.isReady) {
                return;
            }

            var rowsCount = this.map.layers[0].width;
            var colsCount = this.map.layers[0].height;

            var tileSize: number = 32;


            for (var layerId: number = 0; layerId < 2; layerId ++) {
                var tilesIds: number[] = this.map.layers[layerId].data;
                var i: number = 0;
                for (var row: number = 0; row < rowsCount; row++) {
                    for (var col: number = 0; col < colsCount; col++) {
                        var tile = tilesIds[i];
                        var tilesPerRow = 15;
                        var tileRow = (tile / tilesPerRow - 8) | 0;
                        var tileCol = (tile % tilesPerRow - 1) | 0;
                        this.ctx.drawImage(this.image, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, (col * tileSize), (row * tileSize), tileSize, tileSize);
                        i++;
                    }
                }
            }

            var i = 0;

            for (var row: number = 0; row < rowsCount; row++) {
                for (var col: number = 0; col < colsCount; col++) {
                    var ctx = this.ctx;
                    this.ctx.beginPath();
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = 'black';
                    this.ctx.rect(col * tileSize, row * tileSize, col * tileSize + tileSize, row * tileSize + tileSize);
                    this.ctx.stroke();

                    ctx.font="11px monospace";
                    ctx.fillStyle = "yellow";
                    ctx.fillText(i + '', col * tileSize, row * tileSize + tileSize - 3);
                    i++;
                }
            }
        }
    }
}
