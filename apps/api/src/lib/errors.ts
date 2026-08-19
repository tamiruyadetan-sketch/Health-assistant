import type { ErrorCode } from '@health-portal/shared-types';

export class HttpError extends Error {
  readonly status: number;
  readonly code: ErrorCode;

  constructor(status: number, code: ErrorCode, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }
}

export function notFoundError(code: ErrorCode, message: string): HttpError {
  return new HttpError(404, code, message);
}

export function validationError(message: string): HttpError {
  return new HttpError(400, 'VALIDATION_ERROR', message);
}