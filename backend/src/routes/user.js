import { Router } from 'express';
import { getUserDashboard, getUserDonations, getUserAdoptions } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticate, getUserDashboard);
router.get('/donations', authenticate, getUserDonations);
router.get('/adoptions', authenticate, getUserAdoptions);

export default router;
