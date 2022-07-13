import {MapFactory} from "./map/map.factory";
import {AppFactory} from "./app.factory";

describe((MapFactory.name), () => {
    it('should instantiate an app', async () => {
        const app = await AppFactory.create('test.txt');
        expect(app).toBeDefined();
        expect(app.file).toBe('test.txt');
    })
})
