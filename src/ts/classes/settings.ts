/// <reference path="../utils/channels.ts" />

if (!this.localStorage) {
    throw new Error('Need localStorage');
}

interface Element {
    get: any;
    set: any;
}

module Game {
    export class Settings {
        public static get(key: string): any {
            var settings = document.querySelector('game-settings');

            return settings.get(key);
        }

        public static (key: string, val: any): void {
            var settings = document.querySelector('game-settings');

            return settings.set(key, val);
        }

        public static reset(key: string) {
            localStorage.removeItem(key);
        }
    }
}
