module Game {
    export class MapPointer {
        private visibilityTime: number = 1000;
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

        set(x:number, y:number):void {
            var self = this;

            this.visible = true;
            this.active = true;

            this.heroX = this._parent.x;
            this.heroY = this._parent.y;
            this.x = x;
            this.y = y;
            this.timerId = setTimeout(function() {
                self.visible = false;
            }, this.visibilityTime);
        }
    }
}
