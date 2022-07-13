import {AppFactory} from "./app/app.factory";


async function main() {
    const fileName = process.argv.find(arg => arg.startsWith('--file='))?.split('=')[1];
    const outFileName = process.argv.find(arg => arg.startsWith('--output='))?.split('=')[1];
    if (!fileName) {
        throw new Error('No file specified');
    }
    const verbose = process.argv.find(arg => arg.startsWith('--verbose'));
    const app = await AppFactory.create(fileName);
    if (verbose) {
        app.setVerbose()
    }
    if (outFileName) {
        app.setOutFileName(outFileName)
    }
    await app.execute();
}

(async () => await main())()
