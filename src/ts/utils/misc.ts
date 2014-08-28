module utils {
    export function debounce(func, wait) {
        var immediate = false;
        var timeout;

        return function() {
            var context = this;
            var args = arguments;

            clearTimeout(timeout);

            timeout = setTimeout(function() {
                timeout = null;

                if (!immediate)
                    func.apply(context, args);
            }, wait);

            if (immediate && !timeout)
                func.apply(context, args);
        };
    }

    export function log(msg) {
        var channel: Channel = new Channel('log');

        channel.emit('table', msg);
    }

    export function getOffset(elem) {
            var top = 0,
                left = 0;

        while(elem) {
            top = top + parseFloat(elem.offsetTop);
            left = left + parseFloat(elem.offsetLeft);
            elem = elem.offsetParent;
        }

        return {
            top: Math.round(top),
            left: Math.round(left)
        };
    }
}
