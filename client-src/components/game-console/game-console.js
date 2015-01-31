Polymer('game-console', {
    ready: function() {
        this.data = [];

        var logChannel = new utils.Channel('log');

        logChannel.on('table', function(coords) {
            for (var name in coords) {
                var val = coords[name];
                this.data[name] = val;

                var changed = false;

                for (var i = 0; i < this.data.length; i++) {
                    var msg = this.data[i];
                    if (msg.name === name) {
                        msg.value = val;
                        changed = true;
                    }
                }

                if (!changed) {
                    this.data.push({name: name, value: val});
                }
            }
        }.bind(this));
    }
});
