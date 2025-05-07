import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dtos/api-response.dto';
import { Prisma } from '@prisma/client';

type SafePrismaMeta = {
  target?: unknown[];
  cause?: string;
  modelName?: string;
  [key: string]: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { status, message, errors } = this.parseException(exception);

    response.status(status).json(ApiResponse.error(message, errors));
  }

  private parseException(exception: unknown): {
    status: number;
    message: string;
    errors: unknown[];
  } {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(exception);
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return this.handlePrismaValidationError(exception);
    }

    return this.handleUnknownError(exception);
  }

  private handleHttpException(exception: HttpException): {
    status: number;
    message: string;
    errors: unknown[];
  } {
    const status = exception.getStatus();
    const response = exception.getResponse();

    let message = 'An error occurred';
    const errors: unknown[] = [];

    if (typeof response === 'string') {
      message = response;
    } else if (this.isErrorObject(response)) {
      message = response.message || message;
      if (response.errors) {
        errors.push(...(Array.isArray(response.errors) ? response.errors : [response.errors]));
      }
    }

    return { status, message, errors };
  }

  private handlePrismaKnownError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
    errors: unknown[];
  } {
    const errorMap: Record<string, { status: number; message: string }> = {
      P2000: { status: HttpStatus.BAD_REQUEST, message: 'Invalid input value' },
      P2002: {
        status: HttpStatus.CONFLICT,
        message: `Duplicate entry on ${this.getSafeTarget(error)}`,
      },
      P2003: {
        status: HttpStatus.BAD_REQUEST,
        message: `Foreign key constraint failed: ${this.getSafeForeignKeyError(error)}`,
      },
      P2025: {
        status: HttpStatus.NOT_FOUND,
        message: this.getSafeCause(error) || 'Resource not found',
      },
    };

    const defaultError = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database operation failed',
    };

    const { status, message } = errorMap[error.code] || defaultError;

    return {
      status,
      message,
      errors: [this.sanitizeError(error)],
    };
  }

  private handlePrismaValidationError(error: Prisma.PrismaClientValidationError): {
    status: number;
    message: string;
    errors: unknown[];
  } {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: [this.sanitizeError(error)],
    };
  }

  private handleUnknownError(exception: unknown): {
    status: number;
    message: string;
    errors: unknown[];
  } {
    console.error('Unhandled exception:', exception);
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      errors: [],
    };
  }

  private getSafeTarget(error: Prisma.PrismaClientKnownRequestError): string {
    const meta = this.getSafeMeta(error.meta);
    const target = meta.target;

    if (Array.isArray(target)) {
      return target
        .map(t => this.getSafeString(t))
        .filter(Boolean)
        .join(', ');
    }

    return this.getSafeString(target) || 'unknown field';
  }

  private getSafeCause(error: Prisma.PrismaClientKnownRequestError): string {
    const meta = this.getSafeMeta(error.meta);
    return typeof meta?.cause === 'string' ? meta.cause : '';
  }

  private getSafeMeta(meta?: unknown): SafePrismaMeta {
    if (!meta || typeof meta !== 'object') return {};

    const safeMeta: SafePrismaMeta = {};
    const entries = Object.entries(meta);

    for (const [key, value] of entries) {
      if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
        safeMeta[key] = value;
      }
    }

    return safeMeta;
  }

  private getSafeForeignKeyError(error: Prisma.PrismaClientKnownRequestError): string {
    const meta = this.getSafeMeta(error.meta);

    // Safely extract and format constraint information
    const constraint = this.getSafeString(meta.constraint);
    const fieldFromConstraint = this.parseConstraintField(constraint);

    // Get field name from different potential sources
    const fieldSources = [fieldFromConstraint, this.getSafeString(meta.field_name), this.getSafeTarget(error)];

    const fieldName = fieldSources.find(s => s.length > 0) || 'unknown field';
    const modelName = this.getSafeString(meta.modelName) || 'related record';

    return `Foreign key constraint failed: Invalid reference to ${modelName} (${fieldName})`;
  }

  private getSafeString(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    return '';
  }

  private parseConstraintField(constraint?: string): string {
    if (!constraint) return '';

    // Handle both underscore-separated and camelCase constraints
    const parts = constraint.split('_');
    if (parts.length > 1) return parts[1];

    // Fallback to camelCase extraction
    const camelCaseMatch = constraint.match(/[a-z][A-Z]/);
    return camelCaseMatch ? camelCaseMatch[0] : constraint;
  }

  private sanitizeError(error: Error): Record<string, unknown> {
    const baseError = {
      name: error.name,
      message: error.message.replace(/\\n/g, ' '),
    };

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ...baseError,
        code: error.code,
        meta: this.getSafeMeta(error.meta),
      };
    }

    return baseError;
  }

  private isErrorObject(obj: unknown): obj is { message?: string; errors?: unknown } {
    return typeof obj === 'object' && obj !== null;
  }
}
