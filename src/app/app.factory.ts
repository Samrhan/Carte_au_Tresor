import {AppService} from "./app.service";

export class AppFactory {
    static async create(argv: Record<string, string | true>): Promise<AppService> {
        const app = new AppService();

        app.verbose = !!argv.verbose;
        app.hardcoreMode = !!argv.hardcore;

        const outFileName = <string>argv.output;
        if (outFileName) {
            app.outFileName = outFileName;
        }

        return app;
    }
}
