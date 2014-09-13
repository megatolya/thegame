/// <reference path="game-object.ts" />
/// <reference path="../map.ts" />

var cameras: Game.Camera[] = [];

module Game {
    export interface ICameraParams {
        x: number;
        y: number;
        canvas: HTMLCanvasElement;
    }

    export class Camera {
        constructor(params: ICameraParams) {
            this.canvas = params.canvas;
            this.x = params.x;
            this.y = params.y;

            if (this.x <= 0) {
                // TODO use x
                this._x = this.width / 2;
            }

            if (this.y <= 0) {
                this._y = this.height / 2;
            }

            cameras.push(this);

            var resize = () => {
                this.x = Game.GameObject.getCurrent().x - this.width / 2;
                this.y = Game.GameObject.getCurrent().y - this.height / 2;
            };

            window.addEventListener('resize', resize);
            new utils.Channel('settings').on('fullsize', resize);
        }

        set x(newX:number) {
            if (newX < this.width / 2) {
                return;
            }

            if (newX + this.width / 2 > map.width * map.tilewidth) {
                return;
            }

            this._x = newX;
        }

        get x():number {
            return this._x;
        }

        set y(newY:number) {
            if (newY < this.width / 2)
                return;

            if (newY + this.height / 2 > map.height * map.tileheight)
                return;

            this._y = newY;
        }

        get y():number {
            return this._y;
        }

        get startX():number {
            return Math.round(this.x - this.width / 2);
        }

        get startY():number {
            return Math.round(this.y - this.height / 2);
        }

        get endX():number {
            return Math.round(this.x + this.width / 2);
        }

        get endY():number {
            return Math.round(this.y + this.height / 2);
        }

        static getCurrent():Camera {
            return cameras[0];
        }

        private get width(): number {
            return this.canvas.width;
        }

        private get height(): number {
            return this.canvas.height;
        }

        private _x: number = 0;
        private _y: number = 0;
        private canvas: HTMLCanvasElement;
    }
}

