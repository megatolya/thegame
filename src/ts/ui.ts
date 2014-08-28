/// <reference path="utils/channels.ts" />

interface Element {
    innerText: any;
}

(function() {

    var settingsChannel: utils.Channel = new utils.Channel('settings');
    var logChannel: utils.Channel = new utils.Channel('log');
    var domChannel: utils.Channel = new utils.Channel('dom');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('.game').appendChild(canvas);
        new utils.Channel('dom').emit('canvasReady', canvas);

        var checkbox:any = document.querySelector('paper-checkbox');

        checkbox.addEventListener('change', function() {
            settingsChannel.emit('grid', checkbox.checked);
        });

        logChannel.on('table', (coords: any):void => {
            for (var name in coords) {
                var val = coords[name];

                if (typeof val === 'object' && val !== null) {
                    val = JSON.stringify(val);
                }

                if (typeof val === 'number') {
                    val = Math.round(val);
                }

                var elem = document.querySelector('table .' + name);
                if (elem) {
                    elem.innerText = val;
                } else {
                    var tr = document.createElement('tr');
                    var tdName = document.createElement('td');
                    var tdVal = document.createElement('td');

                    tdVal.classList.add(name);

                    tdName.innerText = name;
                    tdVal.innerText = val;

                    tr.appendChild(tdName);
                    tr.appendChild(tdVal);
                    document.querySelector('table').appendChild(tr);
                }
            }
        });
    });



    canvas.addEventListener('click', function(e) {
        var getOffset = utils.getOffset;
        var hero = Game.Player.getCurrent();

        hero.pointer.reset();
        hero.pointer.set(e.pageX - getOffset(canvas).left, e.pageY - getOffset(canvas).top);
    });

})();
