/// <reference path="../utils/channels.ts" />

if (!this.localStorage) {
    throw new Error('Need localStorage');
}

interface Element {
    get: any;
    set: any;
    reset: any;
}

interface ISettings {
    get: any;
    set: any;
    reset: any;
}

function getSettings(): ISettings {
    return document.querySelector('game-settings') || Game.DefaultSettings;
}

module Game {
    export class DefaultSettings {
        public static get(key: string): any {
            return null;
        }

        public static set(key: string, val: any): void {}

        public static reset(key: string) {}
    }

    export class Settings extends DefaultSettings {
        public static get(key: string): any {
            var settings = getSettings();

            return settings.get(key);
        }

        public static set(key: string, val: any): void {
            var settings = document.querySelector('game-settings');

            return settings.set(key, val);
        }

        public static reset(key: string) {
            localStorage.removeItem(key);
        }
    }

}
