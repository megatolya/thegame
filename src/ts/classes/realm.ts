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
        private canvas: HTMLCanvasElement;
        private map: tiledJSON;
        private image: HTMLImageElement;
        private isReady: boolean = false;

        constructor(tileSetPath: string, map: tiledJSON, ctx: CanvasRenderingContext2D ) {
            this.canvas = canvas;
            this.image = new Image();
            this.map = map;
            this.image.src = tileSetPath;
            this.image.onload = () => {
                this.isReady = true;
            }
        }

        draw():void {
            if (!this.isReady) {
                return;
            }

            var rowsCount = this.map.layers[0].width;
            var colsCount = this.map.layers[0].height;
            var ctx = canvas.getContext('2d');

            var tileSize: number = 32;

            var tilesIds: number[] = this.map.layers[0].data;

            var i: number = 0;
            for (var row: number = 0; row < rowsCount; row++) {
                for (var col: number = 0; col < colsCount; col++) {
                    var tile = tilesIds[i] - 1;
                    var tilesPerRow = 15;
                    var tileRow = (tile / tilesPerRow) | 0;
                    var tileCol = (tile % tilesPerRow) | 0;

                    ctx.drawImage(this.image, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, (col * tileSize), (row * tileSize), tileSize, tileSize);
                    i++;
                }
            }
        }
    }
}
