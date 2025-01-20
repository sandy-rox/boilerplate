import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/common/logger/logger.service';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique request IDs

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // Retrieve or generate a request ID
    const requestId = req.headers['x-request-id'] || uuidv4(); // Use x-request-id if provided, else generate one
    req['requestId'] = requestId; // Store request ID in the request object for later use

    // Initialize dynamic log file for the request
    this.loggerService.createRequestLogFile(requestId as string);

    const startTime = process.hrtime();

    res.on('finish', () => {
      const duration = process.hrtime(startTime);
      const requestMetaInfo = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: (duration[0] * 1000 + duration[1] / 1e6).toFixed(3), // duration in ms
        requestId,
      };

      // Log request metadata into the dynamic log file
      this.loggerService.logRequestMessage(
        requestId as string,
        JSON.stringify(requestMetaInfo),
      );
    });
    // Proceed to the next middleware or request handler
    next();
  }
}
