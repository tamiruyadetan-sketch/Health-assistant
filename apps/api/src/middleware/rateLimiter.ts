import type { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';

const RATE_LIMIT_RESPONSE = {
  error: {
    code: 'RATE_LIMITED' as const,
    message: 'Too many requests. Please wait a moment and try again.',
  },
};

/** Baseline limiter applied to all /api routes. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json(RATE_LIMIT_RESPONSE);
  },
});

/** Stricter limiter for /ai/chat, keyed by client sessionId + IP. */
export const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => `${(req.body?.sessionId as string | undefined) ?? 'anon'}:${req.ip ?? 'unknown'}`,
  handler: (_req: Request, res: Response) => {
    res.status(429).json(RATE_LIMIT_RESPONSE);
  },
});