/// <reference path="../utils/channels.ts" />

module Game {
    export class MapPointer {
        private visibilityTime: number = 10000;
        private timerId: number = 0;
        private _parent: Player;

        x: number = 0;
        y: number = 0;

        // TODO
        heroX: number;
        heroY: number;

        visible: boolean = false;
        active: boolean = false;

        constructor(_parent: Player) {
            this._parent = _parent;
        }

        reset():void {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = 0;
                this.active = false;
                this.visible = false;
            }
        }

        set(absX:number, absY:number):void {
            this.visible = true;
            this.active = true;

            var camera = Game.Camera.getCurrent();

            this.heroX = this._parent.x;
            this.heroY = this._parent.y;

            this.x = camera.startX + absX;
            this.y = camera.startY + absY;

            this.timerId = setTimeout(
                () => this.visible = false,
                this.visibilityTime
            );

            utils.log({
                heroGoesToX: this.x,
                heroGoesToY: this.y,
                heroGoesfromX: this.heroX,
                heroGoesfromY: this.heroY
            });
        }

        get absX():number {
            // TODO подумать, где лучше хранить
            return this.x - Game.Camera.getCurrent().startX;
        }

        get absY():number {
            return this.y - Game.Camera.getCurrent().startY;
        }

        draw(ctx: CanvasRenderingContext2D) {
            if (this.visible) {
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.rect(this.absX, this.absY, 10, 10);
                ctx.stroke();
            }
        }
    }
}
