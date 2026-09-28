import { Router } from 'express';
import { getAdminDashboard, getAllDonations, getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/donations', getAllDonations);
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);

export default router;
