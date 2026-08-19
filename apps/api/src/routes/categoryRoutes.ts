import { Router } from 'express';
import { getCategoryBySlugHandler, getCategoriesHandler } from '@/controllers/categoryController';

const router = Router();

router.get('/', getCategoriesHandler);
router.get('/:slug', getCategoryBySlugHandler);

export default router;