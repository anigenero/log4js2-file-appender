# log4js2-file-appender
Provides an HTTP appender for log4js2 that pushes log events to a server endpoint via a `POST` call.

[![Build Status](https://travis-ci.org/anigenero/log4js2-file-appender.svg?branch=master)](https://travis-ci.org/anigenero/log4js2-file-appender)
[![codecov](https://codecov.io/gh/anigenero/log4js2-file-appender/branch/master/graph/badge.svg)](https://codecov.io/gh/anigenero/log4js2-file-appender)
[![dependencies](https://david-dm.org/anigenero/log4js2-file-appender.svg)](https://david-dm.org/anigenero/log4js2-file-appender.svg)

- [Learn About log4js2](https://anigenero.github.io/log4js2)

## Installing & Building

If you're building from source, simply run

```bash
> npm install
> npm run build
```

Or, you can install the appender from npm.

```bash
> npm install --save @log4js2/file-appender
```

#### Configuration

Configure the appender using the `configure()` method.

```typescript
import {configure, LogLevel} from '@log4js2/core';
import {HttpAppender} from '@log4js2/http-appender';

configure({
    level: LogLevel.INFO
    layout: '%d [%p] %c %M:%line:%column - %m %ex',
    appenders: ['Console', {
        name: 'RollingFile',
        appender: RollingFileAppender,
        config: {
            fileName: 'logs/app.log',
            filePattern: 'logs/app.%i.log',
            maxBackup: 5,
            maxSize: 10
        }
    }],
    loggers: [{
        tag: 'App',
        logLevel : LogLevel.INFO,
        appenders: ['Console', 'RollingFile']
    }]
});
```

## Contributors
Library built and maintained by [Robin Schultz](http://anigenero.com)

If you would like to contribute (aka buy me a beer), you can send funds via PayPal at the link below.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SLT7SZ2XFNEUQ)