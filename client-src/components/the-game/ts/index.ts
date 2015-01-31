/// <reference path="ui.ts" />
/// <reference path="transport.ts" />
/// <reference path="map.ts" />
/// <reference path="classes/picture.ts" />
/// <reference path="classes/creatures/knight.ts" />
/// <reference path="classes/creatures/demon.ts" />
/// <reference path="classes/realm.ts" />
/// <reference path="classes/camera.ts" />
/// <reference path="classes/settings.ts" />
/// <reference path="utils/misc.ts" />

var socketChannel = new utils.Channel('socket');

new utils.Channel('dom').on('canvas:ready', (canvas: HTMLCanvasElement):void => {
    //var ctx = canvas.getContext('2d');

    //var hero: Creatures.ICreature = new Creatures.Knight({
        //x: 100,
        //y: 100
    //});

    //var demon: Creatures.ICreature = new Creatures.Demon({
        //x: 150,
        //y: 150
    //});

    //var camera: Game.Camera = new Game.Camera({
        //x: hero.x,
        //y: hero.y,
        //canvas: canvas
    //});

    //var realm: Game.Realm = new Game.Realm('/images/tileset.png', map, camera);

    //this.realm = realm;

    //var frames: number = 0;
    //var milisecSum: number = 0;

    //function update(timeDelta: number):void {
        //milisecSum += timeDelta;
        //frames++;

        //if (milisecSum > 1) {
            //utils.log({
                //fps: frames
            //});

            //milisecSum = 0;
            //frames = 0;
        //}

        ////hero.onTick(timeDelta);
        ////demon.onTick(timeDelta);
        ////camera.x = hero.x;
        ////camera.y = hero.y;
    //}

    //function render():void {
        //realm.draw(ctx);
        ////hero.draw(ctx);
        ////demon.draw(ctx);
    //}

    //function gameLoop():void {
        //var now:number = Date.now();
        //var delta:number = now - then;

        //update(delta / 1000);
        //render();

        //then = now;

        //repaint();
    //}

    //var repaint = utils.debounce(() => requestAnimationFrame(gameLoop), 0);

    //var then:number = Date.now();

    //gameLoop();
});
