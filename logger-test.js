import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import {
  createLogger,
  transports,
  format,
  Logger as WinstonLogger,
  addColors,
} from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; 

const logDir = 'logs';

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom log levels and colors
const logLevels = {
  levels: {
    info: 0,
    warn: 1,
    error: 2,
    debug: 3,
    verbose: 4,
    silly: 5,
  },
  colors: {
    info: 'green',
    warn: 'yellow',
    error: 'red',
    debug: 'blue',
    verbose: 'magenta',
    silly: 'cyan',
  },
};

@Injectable()
export class LoggerService {
  private logger: WinstonLogger;

  constructor() {
    // Set up Winston logger with custom transport options
    this.logger = createLogger({
      levels: logLevels.levels,
      transports: [
        new transports.Console({
          level: process.env.NODE_ENV === 'prod' ? 'error' : 'debug',
          format:
            process.env.NODE_ENV === 'prod'
              ? format.combine(
                  format.colorize(),
                  format.timestamp(),
                  format.json(), // JSON format in production
                )
              : format.combine(
                  format.colorize(),
                  format.timestamp(),
                  format.simple(), // Simple format for development
                ),
        }),

        new transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),

        new transports.File({
          filename: path.join(logDir, 'combined.log'),
          level: 'info',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    });

    addColors(logLevels.colors); // Add color to log levels
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  silly(message: string) {
    this.logger.silly(message);
  }
}



import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { encryptObject } from 'src/helpers/transform-objects';
import { GuardedRequest } from 'src/types/request.types';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private rsaKey: string | undefined;

  constructor(
    private configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.rsaKey = this.configService.get<string>('logger.rsa_key_public'); // Cache RSA key for encryption
  }

  private isErroneousStatusCode(statusCode: number): boolean {
    return statusCode >= 400 && statusCode < 600;
  }

  private encryptRequestBodyOnProduction(body: object): object {
    const nodeEnv = this.configService.get<string>('app.env', 'dev'); // Default to 'dev' if undefined

    if (nodeEnv === 'prod' && this.rsaKey) {
      return encryptObject(this.rsaKey, body); // Use cached RSA key for encryption
    }

    return body;
  }

  // Middleware to log every incoming request
  use(request: GuardedRequest, response: Response, next: NextFunction): void {
    const start = process.hrtime(); // Use high-resolution time
    const requestId =
      request.headers['x-request-id'] ?? new Date().toISOString();
    const { ip, method, originalUrl, body, query, params, headers, user } =
      request;
    const userAgent = request.get('user-agent') ?? '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') ?? 'unknown';

      const responseTime = process.hrtime(start);
      const requestMetaInfo = {
        requestId,
        method,
        originalUrl,
        statusCode,
        responseTime: responseTime[0] * 1000 + responseTime[1] / 1e6,
        ip,
        userAgent,
        body: this.encryptRequestBodyOnProduction(body),
        query,
        params,
        timestamp: new Date().toISOString(),
        contentLength,
        user,
      };

      // Log the request metadata
      if (this.isErroneousStatusCode(statusCode)) {
        this.logger.error(JSON.stringify(requestMetaInfo), 'Request error');
      } else {
        this.logger.info(JSON.stringify(requestMetaInfo));
      }
    });

    next();
  }
}
