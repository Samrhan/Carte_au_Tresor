import {AppFactory} from "./app/app.factory";


async function main() {

    // Getting the program arguments
    // Using yargs format for the arguments, so the order doesn't matter
    let fileName = process.argv.find(arg => arg.startsWith('--file='))?.split('=')[1];
    const outFileName = process.argv.find(arg => arg.startsWith('--output='))?.split('=')[1];
    const verbose = process.argv.find(arg => arg.startsWith('--verbose'));

    // This is secret
    const hardcoreMode = process.argv.find(arg => arg.startsWith('--hardcore'));

    if (!fileName) {
        fileName = process.env.MAP ? process.env.MAP : 'map.txt';
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
