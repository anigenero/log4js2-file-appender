import { createWriteStream, mkdirSync, WriteStream } from 'fs';
import { isAbsolute, resolve, sep } from 'path';

export abstract class FileWriter {

    public static createDirectories(dir: string) {

        const separator = sep;
        const initDirectory = isAbsolute(dir) ? separator : '';
        const baseDirectory = '.';

        return dir.split(separator).reduce((parentDir, childDir) => {

            const currentDirectory = resolve(baseDirectory, parentDir, childDir);
            try {
                mkdirSync(currentDirectory);
            } catch (err) {
                if (err.code === 'EEXIST') {
                    return currentDirectory;
                }

                if (err.code === 'ENOENT') {
                    throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
                }

                const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
                if (!caughtErr || caughtErr && currentDirectory === resolve(dir)) {
                    throw err; // Throw if it's just the last created dir.
                }
            }

            return currentDirectory;
        }, initDirectory);
    }

    protected _logFile: WriteStream;

    protected _appendToFile(messages: string[]): number {

        let size = 0;

        this._logFile.cork();

        messages.forEach((message) => {
            size += Buffer.byteLength(message);
            this._logFile.write(message + '\n');
        });

        process.nextTick(() => this._logFile.uncork());

        return size;

    }

    protected _createStream(fileName: string): WriteStream {
        return createWriteStream(fileName, {
            autoClose: true,
            encoding: 'utf8',
            flags: 'w+'
        });
    }

}
