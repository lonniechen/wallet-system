import * as winston from 'winston';
import {
    Injectable,
    LoggerService,
    Scope
} from '@nestjs/common';
import * as clc from 'cli-color';

const yellow = clc.xterm(3);

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
    private static winstonLogger: winston.Logger;
    private static lastTimestamp?: number;
    private context: string;

    constructor() {
        CustomLoggerService.initWiston();
    }

    public setContext(context: string) {
        this.context = context;
    }

    public static initWiston() {

        let format;
        const transports = [];

        transports.push(new winston.transports.Console());

        format = winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize({ all: true }),
            winston.format.printf((info) => {
                const duration = CustomLoggerService.printTimestamp();
                const meta = info.meta ? info.meta : '';
                const parameters = meta && meta.parameters ? meta.parameters : '';
                const context = meta && meta.context ? meta.context : '';
                const trace = meta && meta.trace ? meta.trace : '';

                return (
                    '[' +
                    yellow(context) +
                    `] ${info.timestamp} ${info.level}: ${info.message} ${duration} ${parameters} ${trace}`
                );
            }),
        );

        CustomLoggerService.winstonLogger = winston.createLogger({
            format: format,
            transports: transports,
        });
    }

    error(message: string, trace: string, context?: string) {
        CustomLoggerService.winstonLogger.log({
            level: 'error',
            message: message,
            meta: {
                trace: trace,
                context: this.context || context,
            },
        });
    }

    private commonLog(
        message: string,
        context: string,
        severity: string,
        meta: any,
    ) {
        CustomLoggerService.winstonLogger.log({
            level: severity,
            message: message,
            meta: Object.assign(
                {
                    context: this.context || context
                },
                meta,
            ),
        });
    }

    log(message: string, context?: string) {
        this.commonLog(message, context, 'info', {});
    }

    warn(message: string, context?: string) {
        this.commonLog(message, context, 'warn', {});
    }

    info(message: string, context?: string) {
        this.commonLog(message, context, 'info', {});
    }

    debug(message: any, context?: string): any {
        this.commonLog(message, context, 'debug', {});
    }

    private static printTimestamp() {
        const res = '';
        CustomLoggerService.lastTimestamp = Date.now();
        return res;
    }
}
