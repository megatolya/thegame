Polymer('game-console', {
    ready: function() {
        var logChannel = new utils.Channel('log');

        logChannel.on('table', function(coords) {
            //for (var name in coords) {
                //var val = coords[name];

                //if (typeof val === 'object' && val !== null) {
                    //val = JSON.stringify(val);
                //}

                //if (typeof val === 'number') {
                    //val = Math.round(val);
                //}

                //var elem = document.querySelector('table .' + name);

                //if (elem) {
                    //elem.innerText = val;
                //} else {
                    //var tr = document.createElement('tr');
                    //var tdName = document.createElement('td');
                    //var tdVal = document.createElement('td');

                    //tdVal.classList.add(name);

                    //tdName.innerText = name;
                    //tdVal.innerText = val;

                    //tr.appendChild(tdName);
                    //tr.appendChild(tdVal);
                    //document.querySelector('table').appendChild(tr);
                //}
            //}
        });
    }
});
