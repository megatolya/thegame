module Game {
    export enum Direction {left, right, up, down, all}

    export class Picture {
        source: HTMLImageElement;
        isReady: boolean = false;
        direction: Direction;

        constructor(src: string, direction: Direction = Direction.all) {
            var img = new Image();
            img.src = src;
            var self = this;
            img.onload = () =>
                self.isReady = true;
            this.source = img;
            this.direction = direction;
        }
    }
}
