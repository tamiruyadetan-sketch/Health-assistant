import { Router } from 'express';
import { chatHandler } from '@/controllers/aiController';
import { chatLimiter } from '@/middleware/rateLimiter';

const router = Router();

router.post('/chat', chatLimiter, chatHandler);

export default router;