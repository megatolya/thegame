/// <reference path="picture.ts" />
/// <reference path="map-pointer.ts" />
/// <reference path="../utils/channels.ts" />

var channel: utils.Channel = new utils.Channel('settings');
var showGrid: boolean = false;

channel.on('grid', function(newGrid: boolean) {
    showGrid = newGrid;
});

module Game {
    export interface playerParams {
        x: number;
        y: number;
        pictures: Array<Picture>;
    }

    export class Player {
        x: number;
        y: number;

        speed: number = 128;
        pointer: MapPointer;

        constructor(params: playerParams) {
            this.x = params.x;
            this.y = params.y;
            this.pictures = params.pictures;
            this.pointer = new MapPointer(this);

            Player.players.push(this)

            setTimeout(function() {
                utils.log({
                    heroX: this.x,
                    heroY: this.y
                });
            }.bind(this), 0);
        }

        get picture():Picture {
            return this.pictures[this.pictureCounter % this.pictures.length];
        }

        get absX():number {
            return this.x - Game.Camera.getCurrent().startX;
        }

        get absY():number {
            return this.y - Game.Camera.getCurrent().startY;
        }

        onTick(timeDelta: number):void {
            if (this.pointer.active) {
                if (Math.abs(this.pointer.x - this.x) < 2 && Math.abs(this.pointer.y - this.y) < 2) {
                    this.pointer.reset();
                    return
                } else {
                    var deltaX:number = this.pointer.deltaX;
                    var deltaY:number = this.pointer.deltaY;

                    var deltaSum:number = Math.abs(deltaX) + Math.abs(deltaY);
                    this.x += deltaX * this.speed * timeDelta / deltaSum;
                    this.y += deltaY * this.speed * timeDelta / deltaSum;
                }

                if (!this.pictureTimer) {
                    this.pictureTimer = setTimeout(this.pictureTimerFn.bind(this), this.picturesTimeout);
                }

                this.checkFailWay();

            } else {
                if (this.pictureTimer) {
                    clearTimeout(this.pictureTimer);
                    this.pictureTimer = 0;
                }
            }

            utils.log({
                heroX: this.x,
                heroY: this.y
            });
        }

        draw(ctx: CanvasRenderingContext2D) {
            this.pointer.draw(ctx);


            // TODO tile class?
            var tileWidth = Game.Realm.getCurrent().tileWidth;
            var tileHeight = Game.Realm.getCurrent().tileWidth;

            if (showGrid) {
                this.hoveredTiles.forEach((tile: any) => {
                    tile.absX = tile.x - Game.Camera.getCurrent().startX;
                    tile.absY = tile.y - Game.Camera.getCurrent().startY;
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'red';
                    ctx.rect(tile.absX, tile.absY, tileWidth, tileHeight);
                    ctx.stroke();
                });
            }

            if (this.picture.isReady) {
                ctx.drawImage(this.picture.source, this.absX - this.width / 2, this.absY - this.height / 2);
            }
        }

        // TODO interval picture
         pictureTimerFn (): void {
            this.pictureCounter++;
            this.pictureTimer = setTimeout(this.pictureTimerFn.bind(this), this.picturesTimeout);
        }

        private checkFailWay(): void {
            var deltaX: number = Math.abs(this.x - this.pointer.x);
            var deltaY: number = Math.abs(this.y - this.pointer.y);

            if ((this.prevDeltaX && this.prevDeltaX < deltaX) || (this.prevDeltaY && this.prevDeltaY < deltaY)) {
                this.x = this.pointer.x;
                this.y = this.pointer.y;
                this.pointer.reset();
                return;
            }

            this.prevDeltaX = deltaX;
            this.prevDeltaY = deltaY;
        }

        get width(): number {
            return this.picture.source.width;
        }

        get height(): number {
            return this.picture.source.height;
        }

        // TODO make it private
        prevDeltaX: number = 0;

        prevDeltaY: number = 0;

        private static players: Player[] = [];

        private pictures: Array<Picture>;
        private pictureTimer: number = 0;
        private picturesTimeout: number = 400;
        private pictureCounter: number = 1;

        static getCurrent(): Player {
            return this.players[0];
        }

        // TODO ITile
        get hoveredTiles(): Game.ITile[] {
            var tiles: Game.ITile[] = Game.Realm.getCurrent().allTiles[0];
            return tiles.filter((tileData: ITile) => {
                return tileData.x > this.x - this.width
                    && tileData.x < this.x + this.width
                    && tileData.y > this.y - this.height
                    && tileData.y < this.y + this.height;
            }, this);
        }
    }
}
