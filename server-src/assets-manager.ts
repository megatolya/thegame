/// <reference path="../typings/server.d.ts" />

import config = require('config');
import md5 = require('MD5');
import path = require('path');

var TILESET_PATH = '/t/';

export interface IRealm {
    tilesetFileName: string;
    tilesetFilePath: string;
    code: string;
}

var nameToCode = Object.create(null);

class Realm implements IRealm {
    constructor (name: string) {
        var config = require('../../assets/realms/' + name + '/realm.json');
        var map = require('../../assets/realms/' + name + '/map.json');

        this._config = config;
        this._map = map;
        this._name = name;
    }

    get tilesetFileName (): string {
        return this._config.tileset;
    }

    get tilesetFilePath (): string  {
        // TODO copy assets to dist
        return path.resolve(__dirname + '../../../assets/realms/' + this._name + '/' + this.tilesetFileName);
    }

    get url(): string {
        return TILESET_PATH + this.code;
    }

    get map() {
        return this._map;
    }

    get code(): string {
        return md5(this.tilesetFileName) + '.png';
    }

    toString(): string {
        return '[Realm ' + this._name + ']';
    }

    toJSON(): string {
        return this.toString();
    }

    private _map;
    private _config;
    private _name;
}

var codeToRealm = Object.create(null);

module.exports = {
    getRealm: (name: string): Realm => {
        if (nameToCode[name]) {
            return codeToRealm[nameToCode[name]];
        }

        var realm = new Realm(name);

        codeToRealm[realm.code] = realm;

        return realm;
    },

    registerHandlers: (app) => {
        app
            .get(TILESET_PATH + ':realmCode', (req, res) => {
                var realmCode = req.params.realmCode;
                var realm = codeToRealm[realmCode];

                if (!realm) {
                    res.status(404);
                    return;
                }

                res.sendFile(realm.tilesetFilePath);
            });
    }
};
