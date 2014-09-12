/// <reference path="../game-object.ts" />
/// <reference path="../picture.ts" />
/// <reference path="../pointer.ts" />

module Creatures {
    export class Demon extends Game.GameObject {
        pointer: Game.Pointer;

        constructor(params: Game.xy) {
            super(params);
            this.pictures = [new Game.Picture('/images/monster.png'), new Game.Picture('/images/monster2.png')];
            this.pointer = new Game.Pointer(this);
        }
    }
}
