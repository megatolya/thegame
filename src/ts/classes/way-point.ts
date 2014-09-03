/// <reference path="../utils/channels.ts" />

// TODO interface Game.MapObject

module Game {
    export class WayPoint {
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
            var camera = Game.Camera.getCurrent();
            var newX = camera.startX + absX;
            var newY = camera.startY + absY;

            if (newX > Game.Realm.getCurrent().width
                || newY > Game.Realm.getCurrent().height
                ) {
                return;
            }

            this.reset();
            this.fromX = this.parent.x;
            this.fromY = this.parent.y;

            this.x = newX;
            this.y = newY;

            this.timerId = setTimeout(
                () => this.visible = false,
                this.visibilityTime
            );

            this.visible = true;
            this.active = true;
        }

        get absX():number {
            return this.x - Game.Camera.getCurrent().startX;
        }

        get absY():number {
            return this.y - Game.Camera.getCurrent().startY;
        }

        draw(ctx: CanvasRenderingContext2D) {
            if (this.visible) {
                ctx.drawImage(this.picture.source, this.absX - this.width / 2, this.absY - this.height / 2);
            }
        }

        get width(): number {
            return this.picture.source.width;
        }

        get height(): number {
            return this.picture.source.height;
        }

        private visibilityTime: number = 10000;
        private timerId: number = 0;
        private parent: Player;

        private picture: Game.Picture;
    }
}
