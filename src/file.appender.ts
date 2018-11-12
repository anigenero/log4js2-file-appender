import { Appender, ILogEvent, LogAppender } from '@log4js2/core';
import { FileHandler } from './handler/file.handler';

export interface IFileAppenderConfig {
    fileName: string;
}

@Appender('File')
export class FileAppender extends LogAppender<IFileAppenderConfig> {

    private readonly _handler: FileHandler;

    constructor(private readonly _config: IFileAppenderConfig) {

        super(_config);

        this._handler = new FileHandler(_config);

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
