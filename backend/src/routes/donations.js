import { Router } from 'express';
import { createOrder, verifyPayment, demoPayment } from '../controllers/donationController.js';
import { authenticate } from '../middleware/auth.js';
import { donationValidation, validate } from '../middleware/validation.js';

const router = Router();

router.post('/create-order', authenticate, donationValidation, validate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/demo-pay', authenticate, demoPayment);

export default router;
