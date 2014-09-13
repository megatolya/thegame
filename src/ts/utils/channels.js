var listeners = {};

var utils;
(function (utils) {
    var Channel = (function () {
        function Channel(name) {
            this.name = name;
        }
        Channel.prototype.emit = function (eventName, data) {
            var handlers = listeners[this.name];

            if (handlers && handlers[eventName]) {
                handlers[eventName].forEach(function (handlerData) {
                    handlerData.callback.call(handlerData.ctx, data);
                });
            }
        };

        Channel.prototype.on = function (eventName, callback) {
            listeners[this.name] = listeners[this.name] || {};
            listeners[this.name][eventName] = listeners[this.name][eventName] || [];
            listeners[this.name][eventName].push({ callback: callback, ctx: {} });
        };

        Channel.prototype.off = function (eventName, callback) {
            listeners[this.name] = listeners[this.name] || {};
            listeners[this.name][eventName] = listeners[this.name][eventName] || [];

            var index = listeners[this.name][eventName].filter(function (listenerData) {
                return listenerData.callback === callback;
            })[0];

            if (index !== undefined) {
                listeners[this.name][eventName].splice(index, 1);
            }
        };
        return Channel;
    })();
    utils.Channel = Channel;
})(utils || (utils = {}));
//# sourceMappingURL=channels.js.map
