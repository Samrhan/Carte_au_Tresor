import {AppFactory} from "./app/app.factory";


async function main() {

    // Getting the program arguments
    const fileName = process.argv.find(arg => arg.startsWith('--file='))?.split('=')[1];
    const outFileName = process.argv.find(arg => arg.startsWith('--output='))?.split('=')[1];
    const verbose = process.argv.find(arg => arg.startsWith('--verbose'));

    // chhh this is secret
    const hardcoreMode = process.argv.find(arg => arg.startsWith('--hardcore'));

    if (!fileName) {
        throw new Error('No file specified');
    }
    const app = await AppFactory.create(fileName);

    if (verbose) {
        app.setVerbose()
    }
    if (outFileName) {
        app.setOutFileName(outFileName)
    }
    if(hardcoreMode) {
        app.setHardcoreMode()
    }

    await app.execute();
}

(async () => await main())()
