var cameras: Game.Camera[] = [];

module Game {
    export interface ICameraParams {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export class Camera {
        private width: number;
        private height: number;
        private _x: number = 0;
        private _y: number = 0;

        constructor(params: ICameraParams) {
            this.width = params.width;
            this.height = params.height;

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
            return this.x - this.width / 2;
        }

        get startY():number {
            return this.y - this.height / 2;
        }

        get endX():number {
            return this.x + this.width / 2;
        }

        get endY():number {
            return this.y + this.height / 2;
        }

        static getCurrent():Camera {
            return cameras[0];
        }
    }
}

