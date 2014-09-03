/// <reference path="classes/settings.ts" />
/// <reference path="utils/channels.ts" />

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
    ready: function() {
        var canvas = this.$.gameCanvas;
        var ctx = canvas.getContext('2d');

        this.setCanvasSize(canvas);

        new utils.Channel('dom').emit('canvasReady', canvas);

        canvas.addEventListener('click', (e) => {
            var getOffset = utils.getOffset;
            var hero = Game.Player.getCurrent();

            hero.pointer.set(e.pageX - getOffset(canvas).left, e.pageY - getOffset(canvas).top);
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
            width = document.body.clientWidth;
            height = document.body.clientHeight;
        } else {
            width = this.width;
            height = this.height;
        }

        var canvasSize = [width, height];

        canvas.width = canvasSize[0];
        canvas.height = canvasSize[1];
        canvas.style.width = canvasSize[0] + 'px';
        canvas.style.height = canvasSize[1] + 'px';
    }
});
