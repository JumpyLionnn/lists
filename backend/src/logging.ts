import * as winston from "winston";
import { Request, Response } from "express";

export function init(){

    const consoleLogMessageFormat = winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${message}`;
    });

    const fileLogMessageFormat = winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
    });

    const timestampFormat = winston.format.timestamp({
        format: "HH:mm:ss"
    });

    const consoleFormat = winston.format.combine(
        timestampFormat,
        consoleLogMessageFormat,
        winston.format.colorize({
            all: true
        })
    );

    const fileFormat = winston.format.combine(
        timestampFormat,
        fileLogMessageFormat
    );

    const logger = winston.createLogger({
        transports: [
          new winston.transports.Console({
            format: consoleFormat,
          }),
         new winston.transports.File({ filename: "logs.log", format: fileFormat })
        ]
    });

    if(process.env.NODE_ENV !== 'production'){
        logger.level = "debug";
    }

    // used for for debugging and troubleshooting
    console.debug = logger.debug.bind(logger);

    // used for more detailed information about the operation of the application
    console.log = logger.verbose.bind(logger);

    // used for general information about the operation of the application
    console.info = logger.info.bind(logger);

    // used for warnings
    console.warn = logger.warn.bind(logger);

    // used for errors
    console.error = logger.error.bind(logger);
}

export function createRequestLogger(){
    return (req: Request, res: Response, next: (err?: any) => any) => {
        console.debug(`${req.method} ${req.originalUrl} with ${req.protocol} protocol.`);
        next();
    };
}