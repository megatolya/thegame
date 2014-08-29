/// <reference path="picture.ts" />
/// <reference path="map-pointer.ts" />
/// <reference path="../utils/channels.ts" />

module Game {
    export interface playerParams {
        x: number;
        y: number;
        pictures: Array<Picture>;
    }

    export class Player {
        x: number;
        y: number;
        pictures: Array<Picture>;
        pictureTimer: number = 0;
        picturesTimeout: number = 400;
        pictureCounter: number = 1;

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
                    this.pictureTimer = setTimeout(this.pictureTimerFn, this.picturesTimeout);
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

            if (this.picture.isReady)
                ctx.drawImage(this.picture.source, this.absX, this.absY);
        }

        private pictureTimerFn (): void {
            this.pictureCounter++;
            this.pictureTimer = setTimeout(this.pictureTimerFn, this.picturesTimeout);
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

        // TODO make it private
        prevDeltaX: number = 0;

        prevDeltaY: number = 0;

        private static players: Player[] = [];

        static getCurrent(): Player {
            return this.players[0];
        }
    }
}
