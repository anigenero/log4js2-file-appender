import { existsSync, renameSync, statSync } from 'fs';
import { throttle } from 'lodash';
import { dirname } from 'path';
import { IRollingFileAppenderConfig } from '../rolling.file.appender';
import { FileWriter } from './file.writer';

export class RollingFileHandler extends FileWriter {

    private readonly _throttledFunction: any;

    private _history: { [key: number]: any } = {};
    private _index: number = 0;
    private _inProcess: boolean = false;
    private _queue: string[] = [];
    private _size: number = 0;

    constructor(private _config: IRollingFileAppenderConfig) {

        super();

        const directory = dirname(this._config.fileName);

        if (!existsSync(directory)) {
            FileWriter.createDirectories(directory);
        }

        if (existsSync(this._config.fileName)) {
            const stats = statSync(this._config.fileName);
            this._size = stats.size;
        }

        this._index = this._getMaxIndex();
        this._logFile = this._createStream(_config.fileName);

        this._throttledFunction = throttle(() => {
            if (!this._inProcess) {
                this._appendFromQueue();
            }
        }, 100);

        process.on('beforeExit', () => {
            this._appendFromQueue(true);
        });

    }

    public append(message: string) {
        this._queue.push(message);
        this._throttledFunction();
    }

    private _appendFromQueue(forceEnd: boolean = false) {

        this._inProcess = true;

        this._size += this._appendToFile([
            ...this._queue.splice(0)
        ]);

        const isExceedMaxSize = this._size > this._config.maxSize;
        if (isExceedMaxSize || forceEnd) {

            this._history[this._index] = this._logFile;
            this._history[this._index].end(() => {

                if (isExceedMaxSize) {

                    this._index++;

                    const fileName = this._config.filePattern
                        .replace(/%i/g, `${this._index}`);

                    renameSync(this._config.fileName, fileName);

                }

                this._logFile = this._createStream(this._config.fileName);
                this._inProcess = false;

            });

        } else {
            this._inProcess = false;
        }

    }

    private _getMaxIndex(): number {
        return 0;
    }

}
