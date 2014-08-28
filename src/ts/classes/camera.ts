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
        private _x: number;
        private _y: number;

        constructor(params: ICameraParams) {
            this.x = params.x;
            this.y = params.y;

            this.width = params.width;
            this.height = params.height;
            cameras.push(this);
        }

        set x(newX:number) {
            if (newX < this.width / 2)
                return;

            this._x = newX;
        }

        get x():number {
            return this._x;
        }

        set y(newY:number) {
            if (newY < this.width / 2)
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
            // TODO
            return cameras[0];
        }
    }
}

