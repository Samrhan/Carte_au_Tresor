import {AppFactory} from "./app/app.factory";
import yargs from "yargs";

async function main() {
    // Getting the program arguments
    // Using yargs, so the order doesn't matter
    const argv = await yargs(process.argv)
        .default('file', 'map.txt')
        .parse() as Record<string, string | true>;

    const app = await AppFactory.create(argv);

    let fileName = <string>argv.file
    await app.execute(fileName);
}

(async () => await main())()
