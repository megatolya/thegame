/// <reference path="classes/settings.ts" />
/// <reference path="utils/channels.ts" />
/// <reference path="classes/game-object.ts" />

interface Element {
    innerText: any;

    getCanvas: any;
}

interface Window {
    Polymer: any;
}

var settings = Game.Settings;


window.Polymer('the-game', {
    width: 500,
    height: 500,
    zoom: 2,

    ready: function() {
        var canvas = this.$.gameCanvas;
        var ctx = canvas.getContext('2d');

        this.setCanvasSize(canvas);

        new utils.Channel('dom').emit('canvasReady', canvas);

        canvas.addEventListener('click', (e) => {
            var getOffset = utils.getOffset;
            var hero = Game.GameObject.getCurrent();

            hero.pointer.set((e.pageX - getOffset(canvas).left) / this.zoom, (e.pageY - getOffset(canvas).top) / this.zoom);
        });

        window.addEventListener('resize', (e) => {
            this.setCanvasSize(canvas);
        });

        var settingsChannel: utils.Channel = new utils.Channel('settings');

        settingsChannel.on('fullsize', (newVal: boolean) => this.setCanvasSize(canvas));
    },

    setCanvasSize(canvas: HTMLCanvasElement): void {
        var fullsize = settings.get('fullsize');
        var width: number;
        var height: number;

        if (fullsize) {
            width = document.body.clientWidth / this.zoom;
            height = document.body.clientHeight / this.zoom;
        } else {
            width = this.width;
            height = this.height;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = (width * this.zoom) + 'px';
        canvas.style.height = (height * this.zoom) + 'px';
    }
});
