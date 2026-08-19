import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from '@/config/env';
import { apiLimiter } from '@/middleware/rateLimiter';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFound';
import categoryRoutes from '@/routes/categoryRoutes';
import diseaseRoutes from '@/routes/diseaseRoutes';
import aiRoutes from '@/routes/aiRoutes';
import healthRoutes from '@/routes/healthRoutes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());

  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',').map((o) => o.trim()),
    })
  );

  app.use(express.json({ limit: '16kb' }));

  app.use('/api', apiLimiter);
  app.use('/api/health', healthRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/diseases', diseaseRoutes);
  app.use('/api/ai', aiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}