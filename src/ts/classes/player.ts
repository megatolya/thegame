/// <reference path="picture.ts" />
/// <reference path="map-pointer.ts" />

module Game {
    export interface playerParams {
        x: number;
        y: number;
        pictures: Array<Picture>;
        blocking: boolean;
    }

    export class Player {
        x: number;
        y: number;
        pictures: Array<Picture>;
        pictureTimer: number = 0;
        picturesTimeout: number = 400;
        pictureCounter: number = 1;

        blocking: boolean;

        speed: number = 128;
        pointer: MapPointer;

        constructor(params: playerParams) {
            this.x = params.x;
            this.y = params.y;
            this.pictures = params.pictures;
            this.pointer = new MapPointer(this);
        }

        set(x: number, y: number):void {
            this.x = x;
            this.y = y;
        }

        get picture():Picture {
            return this.pictures[this.pictureCounter % this.pictures.length];
        }

        // TODO
        onTick(timeDelta: number):void {
            var self = this;
            var moving = false;

            if (38 in keysDown || 87 in keysDown) { //  up
                moving = true;
                this.y -= this.speed * timeDelta;
            }

            if (40 in keysDown || 83 in keysDown) { // down
                moving = true;
                this.y += this.speed * timeDelta;
            }

            if (37 in keysDown || 65 in keysDown) { // left
                moving = true;
                this.x -= this.speed * timeDelta;
            }

            if (39 in keysDown || 68 in keysDown) { // right
                moving = true;
                this.x += this.speed * timeDelta;
            }

            if (this.pointer.active) {
                // если уже двигаешь клавишами, то поинтер сбросить
                if (moving) {
                    this.pointer.reset();
                } else if (Math.abs(this.pointer.x - this.x) < 2 && Math.abs(this.pointer.y - this.y) < 2) {
                    this.pointer.reset();
                } else {
                    var deltaX:number = this.pointer.x - this.pointer.heroX;
                    var deltaY:number = this.pointer.y - this.pointer.heroY;

                    var deltaSum:number = Math.abs(deltaX) + Math.abs(deltaY);
                    this.x += deltaX * this.speed * timeDelta / deltaSum;
                    this.y += deltaY * this.speed * timeDelta / deltaSum;
                }

                moving = true;
            }

            var pictureTimerFn = function() {
                self.pictureCounter++;
                self.pictureTimer = setTimeout(pictureTimerFn, self.picturesTimeout);
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

        draw() {
            if (this.picture.isReady)
                ctx.drawImage(this.picture.source, this.x, this.y);

            if (this.pointer && this.pointer.visible) {
                ctx.beginPath();
                ctx.strokeStyle="blue";
                ctx.rect(this.pointer.x - 5, this.pointer.y - 5, 10, 10);
                ctx.stroke();
            }
        }
    }
}
