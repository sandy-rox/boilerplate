import { Injectable } from '@nestjs/common';
import {
  createLogger,
  transports,
  format,
  Logger as WinstonLogger,
  addColors,
} from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique request IDs

// Ensure the logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

@Injectable()
export class LoggerService {
  private logger: WinstonLogger;

  constructor() {
    // Initialize Winston logger with a default console transport
    this.logger = createLogger({
      transports: [
        new transports.Console({
          level: 'debug',
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.simple(),
          ),
        }),
      ],
    });
  }

  // Creates a log file dynamically based on request ID
  createRequestLogFile(requestId: string): void {
    const requestLogFile = path.join(logDir, `${requestId}.log`);
    if (!fs.existsSync(requestLogFile)) {
      fs.writeFileSync(requestLogFile, ''); // Create an empty file for the request logs
    }
    // Add the dynamic file transport for this specific request ID
    const requestTransport = new transports.File({
      filename: requestLogFile,
      level: 'info', // Adjust log level as necessary
      format: format.combine(format.timestamp(), format.json()),
    });
    this.logger.add(requestTransport);
  }

  // Log info-level messages to the dynamic file
  logRequestMessage(requestId: string, message: string): void {
    this.logger.info(message, { requestId });
  }

  // Log error-level messages to the dynamic file
  logRequestError(requestId: string, message: string, error?: any): void {
    this.logger.error(message, { requestId, error });
  }
}
