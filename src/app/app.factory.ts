import {AppService} from "./app.service";

export class AppFactory {
    static async create(fileName: string): Promise<AppService> {
        return new AppService(fileName);
    }
}
