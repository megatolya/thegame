/// <reference path="../utils/channels.ts" />

module Game {
    export class MapPointer {
        x: number = 0;
        y: number = 0;

        fromX: number;
        fromY: number;

        visible: boolean = false;
        active: boolean = false;

        constructor(parent: Player) {
            this.parent = parent;

            this.picture = new Game.Picture('../images/target.png');
        }

        reset():void {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = 0;
                this.active = false;
                this.visible = false;
            }

            this.parent.prevDeltaX = 0;
            this.parent.prevDeltaY = 0;
        }

        get deltaX(): number {
            return this.x - this.fromX;
        }

        get deltaY(): number {
            return this.y - this.fromY;
        }

        set(absX:number, absY:number):void {
            this.visible = true;
            this.active = true;

            var camera = Game.Camera.getCurrent();

            this.fromX = this.parent.x;
            this.fromY = this.parent.y;

            this.x = camera.startX + absX;
            this.y = camera.startY + absY;

            this.timerId = setTimeout(
                () => this.visible = false,
                this.visibilityTime
            );

            utils.log({
                heroGoesToX: this.x,
                heroGoesToY: this.y,
                heroGoesfromX: this.fromX,
                heroGoesfromY: this.fromY
            });
        }

        get absX():number {
            return this.x - Game.Camera.getCurrent().startX;
        }

        get absY():number {
            return this.y - Game.Camera.getCurrent().startY;
        }

        draw(ctx: CanvasRenderingContext2D) {
            if (this.visible) {
                ctx.drawImage(this.picture.source, this.absX, this.absY);
            }
        }

        private visibilityTime: number = 10000;
        private timerId: number = 0;
        private parent: Player;

        private picture: Game.Picture;
    }
}
