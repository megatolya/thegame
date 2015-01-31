var listeners = {};

module utils {
    export class Channel {
        name: string;

        constructor (name: string) {
            this.name = name;
        }

        emit (eventName: string, data:any) {
            var handlers = listeners[this.name];

            if (handlers && handlers[eventName]) {
                handlers[eventName].forEach(function(handlerData) {
                    handlerData.callback.call(handlerData.ctx, data);
                });
            }
        }

        on (eventName: string, callback: any) {
            listeners[this.name] = listeners[this.name] || {};
            listeners[this.name][eventName] = listeners[this.name][eventName] || [];
            listeners[this.name][eventName].push({callback: callback, ctx: {}});
        }

        off (eventName: string, callback: any) {
            listeners[this.name] = listeners[this.name] || {};
            listeners[this.name][eventName] = listeners[this.name][eventName] || [];

            var index = listeners[this.name][eventName].filter(function(listenerData) {
                return listenerData.callback === callback;
            })[0];

            if (index !== undefined) {
                listeners[this.name][eventName].splice(index, 1);
            }
        }
    }
}
