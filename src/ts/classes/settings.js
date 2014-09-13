/// <reference path="../utils/channels.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (!this.localStorage) {
    throw new Error('Need localStorage');
}

function getSettings() {
    return document.querySelector('game-settings') || Game.DefaultSettings;
}

var Game;
(function (Game) {
    var DefaultSettings = (function () {
        function DefaultSettings() {
        }
        DefaultSettings.get = function (key) {
            return null;
        };

        DefaultSettings.set = function (key, val) {
        };

        DefaultSettings.reset = function (key) {
        };
        return DefaultSettings;
    })();
    Game.DefaultSettings = DefaultSettings;

    var Settings = (function (_super) {
        __extends(Settings, _super);
        function Settings() {
            _super.apply(this, arguments);
        }
        Settings.get = function (key) {
            var settings = getSettings();

            return settings.get(key);
        };

        Settings.set = function (key, val) {
            var settings = document.querySelector('game-settings');

            return settings.set(key, val);
        };

        Settings.reset = function (key) {
            localStorage.removeItem(key);
        };
        return Settings;
    })(DefaultSettings);
    Game.Settings = Settings;
})(Game || (Game = {}));
//# sourceMappingURL=settings.js.map
