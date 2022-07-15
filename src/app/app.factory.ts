import {AppService} from "./app.service";

export class AppFactory {
    static async create(): Promise<AppService> {
        return new AppService();
    }
}
