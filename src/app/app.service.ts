import fs from "fs";
import {MapFactory} from "./map/map.factory";

export class AppService {
    private _outFileName: string | undefined;
    private _verbose = false;
    private _hardcoreMode = false;

    /**
     * Execute the application
     */
    async execute(fileName: string) {
        const map = MapFactory.createMap(fs.readFileSync(fileName, 'utf8'));
        map.explore(this._verbose, this._hardcoreMode);

        const serialized = map.serialize();
        if (!this._outFileName) {
            this._outFileName = fileName.split('.').slice(0, -1).join('.') + '-result.txt';
        }
        fs.writeFileSync(this._outFileName, serialized);
    }

    set verbose(value: boolean) {
        this._verbose = value;
    }

    set outFileName(value: string) {
        this._outFileName = value;
    }

    set hardcoreMode(value: boolean) {
        this._hardcoreMode = value;
    }
}
