import { Router } from 'express';
import { getDiseaseBySlugHandler, searchDiseasesHandler } from '@/controllers/diseaseController';

const router = Router();

router.get('/', searchDiseasesHandler);
router.get('/:slug', getDiseaseBySlugHandler);

export default router;