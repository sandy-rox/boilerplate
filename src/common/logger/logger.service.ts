import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  createLogger,
  transports,
  format,
  Logger as WinstonLogger,
} from 'winston';
import * as fs from 'fs';
import * as path from 'path';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

@Injectable()
export class LoggerService implements OnApplicationShutdown {
  private loggers: Map<string, WinstonLogger> = new Map();

  constructor() {
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      const requestId = args[0]?.requestId || 'global';
      const message = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
        .join(' ');
      this.logMessage(requestId, 'info', message);
      originalLog.apply(console, args);
    };
  }

  private createLoggerForRequest(requestId: string): WinstonLogger {
    const requestLogFile = path.join(logDir, `${requestId}.log`);
    const logger = createLogger({
      transports: [
        new transports.File({
          filename: requestLogFile,
          level: 'info',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    });

    this.loggers.set(requestId, logger);
    return logger;
  }

  private getOrCreateLogger(requestId: string): WinstonLogger {
    return (
      this.loggers.get(requestId) || this.createLoggerForRequest(requestId)
    );
  }

  logMessage(requestId: string, level: string, message: string): void {
    const logger = this.getOrCreateLogger(requestId);
    logger.log(level, message);
  }

  logError(requestId: string, message: string, error?: any): void {
    const logger = this.getOrCreateLogger(requestId);
    logger.error(message, { error });
  }

  removeLogger(requestId: string): void {
    this.loggers.delete(requestId);
  }

  onApplicationShutdown(): void {
    this.loggers.clear();
  }
}
