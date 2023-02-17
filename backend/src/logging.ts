import * as winston from "winston";
import { inspect } from "util";
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
    console.debug = wrapLogFunction(logger.debug.bind(logger));

    // used for more detailed information about the operation of the application
    console.log = wrapLogFunction(logger.verbose.bind(logger));

    // used for general information about the operation of the application
    console.info = wrapLogFunction(logger.info.bind(logger));

    // used for warnings
    console.warn = wrapLogFunction(logger.warn.bind(logger));

    // used for errors
    console.error = wrapLogFunction(logger.error.bind(logger));

    inspect.styles.string = "white";
}

export function createRequestLogger(){
    return (req: Request, res: Response, next: (err?: any) => any) => {
        console.debug(`${req.method} ${req.originalUrl} with ${req.protocol} protocol.`);
        next();
    };
}

function wrapLogFunction(func: (...data: any[]) => void){
    return (...data: any[]) => {
        for (const index in data) {
            if(typeof data[index] !== "string"){
                data[index] = inspect(data[index], {depth: 3, colors: true, maxArrayLength: 20, maxStringLength: 1000});
            }
        }
        func(data.join(" "));
    }
}