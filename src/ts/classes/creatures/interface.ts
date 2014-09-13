/// <reference path="../realm.ts" />

module Creatures {
    export interface ICreature {
        x: number;
        y: number;

        speed: number;
        pointer: any;

        width: number;
        height: number;

        hoveredTiles: Game.ITile[];
        prevDeltaX: number;
        prevDeltaY: number;

        draw(ctx: CanvasRenderingContext2D): void;

        onTick(timeDelta: number): void;
    }
}
