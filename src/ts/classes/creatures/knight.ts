/// <reference path="../game-object.ts" />
/// <reference path="../picture.ts" />
/// <reference path="../pointer.ts" />

module Creatures {
    export class Knight extends Game.GameObject {
        pointer: Game.Pointer;

        constructor(params: Game.xy) {
            super(params);
            this.pictures = [new Game.Picture('/images/hero.png'), new Game.Picture('/images/hero2.png')];
            this.pointer = new Game.Pointer(this);
        }
    }
}
