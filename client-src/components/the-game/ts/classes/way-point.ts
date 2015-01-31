/// <reference path="../utils/channels.ts" />
/// <reference path="creatures/interface.ts" />

module Game {
    export class WayPoint {
        x: number = 0;
        y: number = 0;

        fromX: number;
        fromY: number;

        visible: boolean = false;
        active: boolean = false;

        constructor(parent: Creatures.ICreature) {
            this.parent = parent;
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

            this.visibilityTime && (this.timerId = setTimeout(
                () => this.visible = false,
                this.visibilityTime
            ));

            this.visible = true;
            this.active = true;
        }

        get absX():number {
            return this.x - Game.Camera.getCurrent().startX;
        }

        get absY():number {
            return this.y - Game.Camera.getCurrent().startY;
        }

        draw(ctx: CanvasRenderingContext2D) { }

        private visibilityTime: number = 0;
        private timerId: number = 0;
        private parent: Creatures.ICreature;
    }
}