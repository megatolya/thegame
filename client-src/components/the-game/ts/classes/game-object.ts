/// <reference path="picture.ts" />
/// <reference path="way-point.ts" />
/// <reference path="creatures/interface.ts" />
/// <reference path="settings.ts" />
/// <reference path="../utils/channels.ts" />

module Game {
    export class GameObject implements Creatures.ICreature {
        private showGrid: boolean;

        x: number;
        y: number;

        speed: number = 80;
        pointer: WayPoint;

        constructor(params: Game.xy) {
            this.x = params.x;
            this.y = params.y;
            this.pictures = [];
            this.pointer = new WayPoint(this);

            GameObject.players.push(this);

            this.showGrid = Game.Settings.get('grid');

            new utils.Channel('settings').on('grid', (newVal: boolean) => {
                this.showGrid = newVal;
            });
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

        draw(ctx: CanvasRenderingContext2D) {
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
        }

        onTick(timeDelta: number): void {
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
                    var deltaX:number = this.pointer.deltaX;
                    var deltaY:number = this.pointer.deltaY;

                    var deltaSum:number = Math.abs(deltaX) + Math.abs(deltaY);
                    var prevX = this.x;
                    var prevY = this.y;

                    this.x += deltaX * this.speed * timeDelta / deltaSum;

                    if (this.hoveredTiles.some((tile: Game.ITile): boolean => tile.blocking)) {
                        this.x = prevX;
                    }

                    this.y += deltaY * this.speed * timeDelta / deltaSum;

                    if (this.hoveredTiles.some((tile: Game.ITile): boolean => tile.blocking)) {
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
        }

        // ушел дальше, чем указывает WayPoint
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

        private static players: GameObject[] = [];

        private pictureTimer: number = 0;
        private picturesTimeout: number = 400;
        private pictureCounter: number = 1;

        private deltaSum: number = 0;

        static getCurrent(): GameObject {
            return this.players[0];
        }

        get hoveredTiles(): Game.ITile[] {
            var tiles: Game.ITile[] = Game.Realm.getCurrent().allTiles[1];
            // TODO Нормальные условия
            tiles = tiles.filter((tileData: ITile) => {
                return tileData.x > this.x - this.width
                    && tileData.x < this.x + this.width
                    && tileData.y < this.y + Game.Realm.getCurrent().tileHeight
                    && tileData.y > this.y
            }, this);
            tiles.pop();

            return tiles;
        }

        pictures: Array<Picture>;
    }
}
