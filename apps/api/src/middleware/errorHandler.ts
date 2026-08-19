import type { ErrorRequestHandler } from 'express';
import type { ErrorCode } from '@health-portal/shared-types';
import { HttpError } from '@/lib/errors';

const isProd = process.env.NODE_ENV === 'production';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  console.error('[api] Unhandled error:', err);

  const status = typeof err?.status === 'number' && err.status >= 400 ? err.status : 500;
  const code: ErrorCode = 'UNKNOWN_ERROR';
  const message = isProd ? 'An unexpected error occurred.' : err?.message ?? 'An unexpected error occurred.';

  res.status(status).json({ error: { code, message } });
};