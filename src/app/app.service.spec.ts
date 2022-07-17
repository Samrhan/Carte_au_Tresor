import {AppService} from "./app.service";
import fs from "fs";
import {MapFactory} from "./map/map.factory";
import {MapService} from "./map/map.service";

describe(AppService.name, () => {
    let appService: AppService;
    let mapService: MapService;

    beforeAll(() => {
        jest.spyOn(fs, 'readFileSync').mockReturnValue('')
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
        })

        mapService = new MapService({width: 10, height: 10});
        jest.spyOn(MapFactory, 'createMap').mockReturnValue(mapService);
        jest.spyOn(mapService, 'explore').mockImplementation(() => {});
        jest.spyOn(mapService, 'serialize').mockImplementation(() => '');
    })

    beforeEach(() => {
        appService = new AppService();
    });

    it("should create a map", async () => {
        await appService.execute('test.txt');
        expect(MapFactory.createMap).toHaveBeenCalledWith('');
    })

    it("should compute movements", async () => {
        await appService.execute('test.txt');
        expect(mapService.explore).toHaveBeenCalled();
    })

    it("should serialize map", async () => {
        await appService.execute('test.txt');
        expect(mapService.serialize).toHaveBeenCalledWith();
    })

    it("should write file", async () => {
        await appService.execute('test.txt');
        expect(fs.writeFileSync).toHaveBeenCalledWith('test-result.txt', '');
    })

    it("should set verbose to true", async () => {
        appService.verbose = true;
        expect((appService as any)._verbose).toBeTruthy();
    })

    it("should set out file name", async () => {
        appService.outFileName = 'funnyoutfilename.txt';
        expect((appService as any)._outFileName).toBe('funnyoutfilename.txt');
    })

    it("should set hardcore mode to true", async () => {
        appService.hardcoreMode = true;
        expect((appService as any)._hardcoreMode).toBeTruthy();
    })

})
