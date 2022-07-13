import fs from "fs";
import {MapFactory} from "./map/map.factory";

export class AppService {
    file: string;
    outFileName: string | undefined;

    verbose = false;

    constructor(fileName: string) {
        this.file = fileName;
    }

    async execute() {
        const map = MapFactory.createMap(fs.readFileSync(this.file, 'utf8'));
        map.computeMovements(this.verbose);
        const serialized = map.serialize();
        if(!this.outFileName) {
            this.outFileName = this.file.split('.')[0] + '-result.txt';
        }
        fs.writeFileSync(this.outFileName, serialized);
    }

    setVerbose() {
        this.verbose = true;
    }

    setOutFileName(outFileName: string) {
        this.outFileName = outFileName;
    }
}
