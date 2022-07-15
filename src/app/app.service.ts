import fs from "fs";
import {MapFactory} from "./map/map.factory";

export class AppService {
    outFileName: string | undefined;

    verbose = false;
    hardcoreMode = false;

    /**
     * Execute the application
     */
    async execute(fileName: string) {
        const map = MapFactory.createMap(fs.readFileSync(fileName, 'utf8'));
        map.computeMovements(this.verbose, this.hardcoreMode);
        const serialized = map.serialize();
        if(!this.outFileName) {
            this.outFileName = fileName.split('.')[0] + '-result.txt';
        }
        fs.writeFileSync(this.outFileName, serialized);
    }

    setVerbose() {
        this.verbose = true;
    }

    setOutFileName(outFileName: string) {
        this.outFileName = outFileName;
    }

    setHardcoreMode() {
        this.hardcoreMode = true;
    }
}
