import { Appender, ILogEvent, LogAppender } from '@log4js2/core';
import { RollingFileHandler } from './handler/rolling.file.handler';

export interface IRollingFileAppenderConfig {

    fileName: string;
    filePattern: string;
    maxBackup: number;
    maxSize: number;

}

@Appender('RollingFile')
export class RollingFileAppender extends LogAppender<IRollingFileAppenderConfig> {

    private _handler: RollingFileHandler;

    constructor(private readonly _config: IRollingFileAppenderConfig = {
        fileName: './logs/app.log',
        filePattern: './logs/app.%i.log',
        maxBackup: 5,
        maxSize: 10
    }) {

        super(_config);

        this._config = {
            ..._config,
            maxSize: _config.maxSize * 1024 * 1024
        };

        this._handler = new RollingFileHandler(this._config);

    }

    /**
     * Appends the log event
     * @param {ILogEvent} logEvent
     */
    public append(logEvent: ILogEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            process.nextTick(() => this._handler.append(this.format(logEvent)));
        }
    }

}
