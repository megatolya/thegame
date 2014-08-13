/// <reference path="utils/channels.ts" />

var settingsChannel: Utils.Channel = new Utils.Channel('settings');
var logChannel: Utils.Channel = new Utils.Channel('log');

interface Element {
    innerText: any;
}

document.addEventListener('DOMContentLoaded', function() {
    var checkbox:any = document.querySelector('paper-checkbox');

    checkbox.addEventListener('change', function() {
        settingsChannel.emit('grid', checkbox.checked);
    });

    logChannel.on('table', function(coords: any):void {
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
