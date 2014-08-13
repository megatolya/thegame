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

        x: number;
        y: number;

        constructor(params: ICameraParams) {
            this.x = params.x;
            this.y = params.y;

            // TODO коэф
            // TODO убрать canvas
            this.width = params.width;
            this.height = params.height;
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
    }
}
