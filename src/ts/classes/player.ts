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

        private static players: Player[] = [];

        static getCurrent(): Player {
            return this.players[0];
        }

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
            // TODO подумать, где лучше хранить
            return this.x - Game.Camera.getCurrent().startX;
        }

        get absY():number {
            return this.y - Game.Camera.getCurrent().startY;
        }

        // TODO
        onTick(timeDelta: number):void {
            var moving = false;

            if (this.pointer.active) {
                // TODO
                if (Math.abs(this.pointer.x - this.x) < 2 && Math.abs(this.pointer.y - this.y) < 2) {
                    this.pointer.reset();
                } else {
                    var deltaX:number = this.pointer.x - this.pointer.heroX;
                    var deltaY:number = this.pointer.y - this.pointer.heroY;

                    var deltaSum:number = Math.abs(deltaX) + Math.abs(deltaY);
                    this.x += deltaX * this.speed * timeDelta / deltaSum;
                    this.y += deltaY * this.speed * timeDelta / deltaSum;
                }

                moving = true;

                var channel: utils.Channel = new utils.Channel('log');

                utils.log({
                    heroX: this.x,
                    heroY: this.y
                });
            }

            var pictureTimerFn = () => {
                this.pictureCounter++;
                this.pictureTimer = setTimeout(pictureTimerFn, this.picturesTimeout);
            }

            if (moving) {
                if (!this.pictureTimer) {
                    this.pictureTimer = setTimeout(pictureTimerFn, this.picturesTimeout);
                }
            } else {
                if (this.pictureTimer) {
                    clearTimeout(this.pictureTimer);
                    this.pictureTimer = 0;
                }
            }
        }

        draw(ctx: CanvasRenderingContext2D) {
            if (this.picture.isReady)
                ctx.drawImage(this.picture.source, this.absX, this.absY);

            this.pointer.draw(ctx);
        }
    }
}
