import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RateLimitStore } from '../../application/rate-limit/rate-limit.store';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(private readonly rateLimitStore: RateLimitStore) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.originalUrl || request.url || '';
    const path = request.path || '';

    // Exempt health check
    if (
      url.includes('/health') ||
      path.includes('/health') ||
      url.endsWith('/health') ||
      path.endsWith('/health')
    ) {
      return true;
    }

    // Rate limit ONLY POST /api/notes
    const isPostNotes =
      method === 'POST' &&
      (url.includes('/notes') || path.includes('/notes'));

    if (!isPostNotes) {
      return true;
    }

    const ip = this.getClientIp(request);
    const endpoint = `${method}:/api/notes`;

    const result = await this.rateLimitStore.checkAndIncrement(ip, endpoint);

    if (!result.allowed) {
      const response = context.switchToHttp().getResponse<Response>();
      response.setHeader('Retry-After', String(result.retryAfter));
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getClientIp(request: Request): string {
    if (request.ip) {
      return request.ip;
    }
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded)) {
      return forwarded[0].split(',')[0].trim();
    }
    return request.socket?.remoteAddress || 'unknown';
  }

  private getNormalizedPath(request: Request, url: string): string {
    // Normalize to /api/notes for the endpoint key
    if (url.includes('/api/notes')) {
      return '/api/notes';
    }
    if (url.includes('/notes')) {
      return '/notes';
    }
    return request.path || url;
  }
}
