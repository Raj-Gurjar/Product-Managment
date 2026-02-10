import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  private readonly isDevelopment = process.env.NODE_ENV !== 'production';

  use(req: Request, res: Response, next: NextFunction) {

    if (!this.isDevelopment) {
      return next();
    }

    const { method, originalUrl, body, query, params, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.socket.remoteAddress || 'Unknown';
    const startTime = Date.now();

  
    this.logger.log(
      `\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      ` REQUEST\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔹 Method: ${method} , URL : ${originalUrl} , IP : ${ip} , User-Agent : ${userAgent} , Timestamp : ${new Date().toISOString()}\n` +
      (params && Object.keys(params).length > 0 ? `🔹 Params: ${JSON.stringify(params)}\n` : '') +
      (query && Object.keys(query).length > 0 ? `🔹 Query: ${JSON.stringify(query)}\n` : '') +
      (body && Object.keys(body).length > 0 ? `🔹 Body: ${JSON.stringify(body, null, 2)}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    );

    
    const originalSend = res.send;
    let responseBody: any;

    res.send = function (body: any) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
       
      let statusEmoji = '✅';
      let statusLabel = 'SUCCESS';
      if (statusCode >= 400 && statusCode < 500) {
        statusEmoji = '⚠️';
        statusLabel = 'CLIENT ERROR';
      } else if (statusCode >= 500) {
        statusEmoji = '❌';
        statusLabel = 'SERVER ERROR';
      } else if (statusCode >= 300 && statusCode < 400) {
        statusEmoji = '↪️';
        statusLabel = 'REDIRECT';
      }

      let parsedBody = '';
      try {
        if (responseBody) {
          const parsed = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
          parsedBody = JSON.stringify(parsed, null, 2);

          if (parsedBody.length > 1000) {
            parsedBody = parsedBody.substring(0, 1000) + '\n... [truncated]';
          }
        }
      } catch {
        parsedBody = responseBody?.toString()?.substring(0, 500) || '';
      }

      this.logger.log(
        `\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `RESPONSE\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🔹 Method: ${method} , URL : ${originalUrl} , Status : ${statusEmoji} ${statusCode} (${statusLabel}) , Duration : ${duration}ms\n` +
        (parsedBody ? `🔹 Response:\n${parsedBody}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
    });

    next();
  }
}
