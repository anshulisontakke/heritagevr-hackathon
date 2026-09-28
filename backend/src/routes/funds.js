import { Router } from 'express';
import { getFundOverview } from '../controllers/fundController.js';

const router = Router();

router.get('/overview', getFundOverview);

export default router;
