/// <reference path="../utils/channels.ts" />
/// <reference path="creatures/interface.ts" />

module Game {
    export class Pointer extends WayPoint {
        constructor(parent: Creatures.ICreature) {
            super(parent);

            this.picture = new Game.Picture('/images/target.png');
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

        private picture: Game.Picture;
    }
}
